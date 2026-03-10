from __future__ import annotations

import argparse
import csv
import json
import os
import shutil
import subprocess
import sys
import time
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
QUEUE_CSV = ROOT / "clients_deploy_queue.csv"
CONTACTS_CSV = ROOT / "outreach" / "deployed_contacts.csv"
REDEPLOY_RESULTS_CSV = ROOT / "reports" / "redeploy_meta_refresh_results.csv"
LOCAL_VERCEL_DIR = ROOT / ".vercel"
LOCAL_PROJECT_JSON = LOCAL_VERCEL_DIR / "project.json"


def detect_vercel_cmd() -> list[str]:
    explicit = Path(r"C:\Users\Krysiek\AppData\Roaming\npm\vercel.cmd")
    if explicit.exists():
        return [str(explicit)]
    if shutil.which("vercel"):
        return ["vercel"]
    if shutil.which("npx"):
        return ["npx", "vercel"]
    raise RuntimeError("Could not find Vercel CLI (vercel or npx)")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Deploy all (or selected) trainer projects from one source repo"
    )
    parser.add_argument(
        "--team-id",
        default=os.environ.get("VERCEL_TEAM_ID", "").strip(),
        help="Vercel team id, e.g. team_xxx (or set VERCEL_TEAM_ID)",
    )
    parser.add_argument(
        "--token",
        default=os.environ.get("VERCEL_TOKEN", "").strip(),
        help="Vercel API token (or set VERCEL_TOKEN)",
    )
    parser.add_argument(
        "--status",
        default="deployed",
        help="Queue status to deploy (default: deployed)",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=0,
        help="Optional limit of projects (0 = no limit)",
    )
    parser.add_argument(
        "--delay-seconds",
        type=float,
        default=0.2,
        help="Delay between deployments to avoid bursts",
    )
    parser.add_argument(
        "--require-email",
        action="store_true",
        help="Deploy only leads with non-empty email in outreach/deployed_contacts.csv",
    )
    parser.add_argument(
        "--new-deploy-only",
        action="store_true",
        help="Deploy only slugs marked as deployed in reports/redeploy_meta_refresh_results.csv",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print targets only (no Vercel deploy calls)",
    )
    return parser.parse_args()


def get_projects_index(token: str, team_id: str) -> dict[str, dict]:
    projects: dict[str, dict] = {}
    until = ""

    while True:
        base = "https://api.vercel.com/v9/projects?limit=100"
        query = f"&teamId={team_id}" if team_id else ""
        if until:
            query += f"&until={until}"
        req = urllib.request.Request(
            f"{base}{query}",
            headers={
                "Authorization": f"Bearer {token}",
                "Accept": "application/json",
            },
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8", errors="ignore"))

        batch = data.get("projects") or []
        for item in batch:
            name = (item.get("name") or "").strip()
            if name:
                projects[name] = item

        pagination = data.get("pagination") or {}
        next_until = pagination.get("next")
        if not next_until:
            break
        until = str(next_until)

    return projects


def load_targets(
    status: str,
    limit: int,
    require_email: bool,
    new_deploy_only: bool,
) -> list[dict[str, str]]:
    rows = list(csv.DictReader(QUEUE_CSV.open(encoding="utf-8", newline="")))
    targets: list[dict[str, str]] = [
        {
            "slug": (row.get("slug") or "").strip(),
            "project": (row.get("vercel_project") or "").strip(),
        }
        for row in rows
        if (row.get("status") or "").strip() == status
        and (row.get("slug") or "").strip()
        and (row.get("vercel_project") or "").strip()
    ]

    if require_email:
        contacts = {
            (row.get("slug") or "").strip(): (row.get("email") or "").strip()
            for row in csv.DictReader(CONTACTS_CSV.open(encoding="utf-8", newline=""))
        }
        targets = [item for item in targets if contacts.get(item["slug"], "").strip()]

    if new_deploy_only:
        redeploy_status = {
            (row.get("slug") or "").strip(): (row.get("status") or "").strip()
            for row in csv.DictReader(
                REDEPLOY_RESULTS_CSV.open(encoding="utf-8", newline="")
            )
        }
        targets = [
            item for item in targets if redeploy_status.get(item["slug"]) == "deployed"
        ]

    if limit and limit > 0:
        return targets[:limit]
    return targets


def write_local_vercel_project(org_id: str, project_id: str, project_name: str) -> None:
    LOCAL_VERCEL_DIR.mkdir(parents=True, exist_ok=True)
    LOCAL_PROJECT_JSON.write_text(
        json.dumps(
            {
                "projectId": project_id,
                "orgId": org_id,
                "projectName": project_name,
            },
            ensure_ascii=True,
        ),
        encoding="utf-8",
    )


def deploy_one(token: str, team_id: str, slug: str) -> subprocess.CompletedProcess:
    args = [
        *detect_vercel_cmd(),
        "deploy",
        "--prod",
        "--yes",
        "--token",
        token,
        "--scope",
        team_id,
        "--build-env",
        f"VITE_CLIENT_SLUG={slug}",
    ]

    return subprocess.run(
        args,
        cwd=str(ROOT),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
        text=True,
        encoding="utf-8",
        errors="ignore",
    )


def main() -> int:
    args = parse_args()
    if not args.token:
        print("Missing VERCEL_TOKEN", file=sys.stderr)
        return 1
    if not args.team_id:
        print("Missing VERCEL_TEAM_ID (--team-id)", file=sys.stderr)
        return 1

    targets = load_targets(
        status=args.status,
        limit=args.limit,
        require_email=args.require_email,
        new_deploy_only=args.new_deploy_only,
    )
    if not targets:
        print("No target projects found")
        return 0

    print(
        f"TARGETS count={len(targets)} status={args.status} "
        f"require_email={args.require_email} new_deploy_only={args.new_deploy_only}"
    )
    if args.dry_run:
        for item in targets:
            print(f"DRY {item['project']} ({item['slug']})")
        print("DONE dry-run")
        return 0

    index = get_projects_index(args.token, args.team_id)

    ok = 0
    failed = 0

    for item in targets:
        slug = item["slug"]
        project_name = item["project"]
        meta = index.get(project_name)
        if not meta:
            failed += 1
            print(f"FAIL {project_name}: project not found in Vercel scope")
            continue

        project_id = (meta.get("id") or "").strip()
        account_id = (meta.get("accountId") or "").strip()
        if not project_id or not account_id:
            failed += 1
            print(f"FAIL {project_name}: missing project/account id")
            continue

        write_local_vercel_project(
            org_id=account_id,
            project_id=project_id,
            project_name=project_name,
        )
        run = deploy_one(args.token, args.team_id, slug)

        if run.returncode == 0:
            ok += 1
            lines = [line for line in run.stdout.splitlines() if "https://" in line]
            deploy_line = lines[-1] if lines else ""
            print(f"OK {project_name} ({slug}) {deploy_line}".strip())
        else:
            failed += 1
            msg = (run.stderr or run.stdout).strip().replace("\n", " ")
            print(f"FAIL {project_name} ({slug}): {msg[:240]}")

        time.sleep(max(args.delay_seconds, 0.0))

    print(f"DONE total={len(targets)} ok={ok} failed={failed}")
    return 0 if failed == 0 else 2


if __name__ == "__main__":
    raise SystemExit(main())
