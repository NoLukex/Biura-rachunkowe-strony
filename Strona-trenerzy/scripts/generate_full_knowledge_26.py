from __future__ import annotations

import csv
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
QUEUE_CSV = ROOT / "clients_deploy_queue.csv"
CONTACTS_CSV = ROOT / "outreach" / "deployed_contacts.csv"
PLAYBOOK_CSV = ROOT / "outreach" / "personalized_outreach_playbook.csv"
REDEPLOY_CSV = ROOT / "reports" / "redeploy_meta_refresh_results.csv"
OUT_JSON = ROOT / "outreach" / "new_deploy_with_email_everything_26.json"
OUT_MD = ROOT / "outreach" / "new_deploy_with_email_everything_26.md"


def read_csv(path: Path) -> list[dict[str, str]]:
    if not path.exists():
        return []
    with path.open(encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def csv_files_with_slug() -> list[Path]:
    pools = [
        ROOT / "outreach",
        ROOT / "reports",
        ROOT / "data" / "deploy_reports",
    ]
    found: list[Path] = []
    for pool in pools:
        if not pool.exists():
            continue
        for file in sorted(pool.rglob("*.csv")):
            try:
                with file.open(encoding="utf-8", newline="") as f:
                    reader = csv.DictReader(f)
                    headers = [h.strip().lower() for h in (reader.fieldnames or [])]
                    if "slug" in headers:
                        found.append(file)
            except Exception:
                continue
    return found


def main() -> int:
    queue_rows = read_csv(QUEUE_CSV)
    contact_rows = read_csv(CONTACTS_CSV)
    playbook_rows = read_csv(PLAYBOOK_CSV)
    redeploy_rows = read_csv(REDEPLOY_CSV)

    contacts_by_slug = {
        r.get("slug", "").strip(): r for r in contact_rows if r.get("slug", "").strip()
    }
    playbook_by_slug = {
        r.get("slug", "").strip(): r for r in playbook_rows if r.get("slug", "").strip()
    }
    redeploy_by_slug = {
        r.get("slug", "").strip(): r for r in redeploy_rows if r.get("slug", "").strip()
    }

    targets: list[dict[str, str]] = []
    for row in queue_rows:
        slug = (row.get("slug") or "").strip()
        if not slug:
            continue
        if (row.get("status") or "").strip() != "deployed":
            continue
        if (redeploy_by_slug.get(slug, {}).get("status") or "").strip() != "deployed":
            continue
        if not (contacts_by_slug.get(slug, {}).get("email") or "").strip():
            continue
        targets.append(row)

    all_slug_csv_files = csv_files_with_slug()
    csv_index: dict[str, list[dict[str, Any]]] = {}
    for file in all_slug_csv_files:
        rel = str(file.relative_to(ROOT)).replace("\\", "/")
        rows = read_csv(file)
        by_slug: dict[str, list[dict[str, str]]] = {}
        for r in rows:
            slug = (r.get("slug") or "").strip()
            if not slug:
                continue
            by_slug.setdefault(slug, []).append(r)
        csv_index[rel] = [{"slug": k, "rows": v} for k, v in by_slug.items()]

    dossier: list[dict[str, Any]] = []
    now = datetime.now(timezone.utc).isoformat()

    for row in targets:
        slug = (row.get("slug") or "").strip()
        vercel_project = (row.get("vercel_project") or "").strip()
        profile_path = ROOT / "klienci" / slug / "profile.ts"
        profile_text = (
            profile_path.read_text(encoding="utf-8") if profile_path.exists() else ""
        )

        records_by_file: dict[str, list[dict[str, str]]] = {}
        for rel, grouped in csv_index.items():
            matches = []
            for item in grouped:
                if item["slug"] == slug:
                    matches.extend(item["rows"])
            if matches:
                records_by_file[rel] = matches

        dossier.append(
            {
                "slug": slug,
                "title": (
                    contacts_by_slug.get(slug, {}).get("title")
                    or playbook_by_slug.get(slug, {}).get("title")
                    or slug
                ),
                "first_name": (
                    playbook_by_slug.get(slug, {}).get("first_name") or ""
                ).strip(),
                "canonical_vercel_project": vercel_project,
                "canonical_vercel_url": f"https://{vercel_project}.vercel.app"
                if vercel_project
                else "",
                "sources": {
                    "queue": row,
                    "contacts": contacts_by_slug.get(slug, {}),
                    "playbook": playbook_by_slug.get(slug, {}),
                    "redeploy_meta": redeploy_by_slug.get(slug, {}),
                },
                "profile_source": {
                    "path": str(profile_path.relative_to(ROOT)).replace("\\", "/")
                    if profile_path.exists()
                    else "",
                    "exists": profile_path.exists(),
                    "profile_ts": profile_text,
                },
                "records_by_file": records_by_file,
            }
        )

    payload = {
        "generated_at_utc": now,
        "criteria": {
            "queue_status": "deployed",
            "redeploy_status": "deployed",
            "email_required": True,
        },
        "count": len(dossier),
        "files_scanned_with_slug": sorted(csv_index.keys()),
        "people": dossier,
    }

    OUT_JSON.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    lines = [
        "# Full knowledge: new_deploy + email (26)",
        "",
        f"Generated UTC: {now}",
        f"Count: {len(dossier)}",
        "",
        f"Main JSON: `outreach/{OUT_JSON.name}`",
        "",
        "## People",
        "",
    ]
    for i, person in enumerate(dossier, 1):
        lines.append(
            f"{i}. {person['title']} ({person['slug']}) - {person['sources'].get('contacts', {}).get('email', '')}"
        )

    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"written_json {OUT_JSON}")
    print(f"written_md {OUT_MD}")
    print(f"count {len(dossier)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
