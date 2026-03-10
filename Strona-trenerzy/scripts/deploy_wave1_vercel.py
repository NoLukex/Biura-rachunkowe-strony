from __future__ import annotations

import csv
import json
import re
import shutil
import subprocess
import argparse
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT.parent
FILTERED_CSV = BASE / "trenerzy_bydgoszcz_personalni.csv"
QUEUE_CSV = ROOT / "clients_deploy_queue.csv"
MCP_CONFIG = Path(r"C:\Users\Krysiek\.gemini\antigravity\mcp_config.json")
DEFAULT_WAVE_NAME = "wave1"
DEFAULT_WAVE_SIZE = 10


def detect_vercel_cmd() -> list[str]:
    explicit = Path(r"C:\Users\Krysiek\AppData\Roaming\npm\vercel.cmd")
    if explicit.exists():
        return [str(explicit)]
    if shutil.which("vercel"):
        return ["vercel"]
    return ["npx", "vercel"]


VERCEL_CMD = detect_vercel_cmd()


def slugify(text: str, used: set[str]) -> str:
    text = (
        text.replace("ą", "a")
        .replace("ć", "c")
        .replace("ę", "e")
        .replace("ł", "l")
        .replace("ń", "n")
        .replace("ó", "o")
        .replace("ś", "s")
        .replace("ź", "z")
        .replace("ż", "z")
        .replace("Ą", "a")
        .replace("Ć", "c")
        .replace("Ę", "e")
        .replace("Ł", "l")
        .replace("Ń", "n")
        .replace("Ó", "o")
        .replace("Ś", "s")
        .replace("Ź", "z")
        .replace("Ż", "z")
        .lower()
    )
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    if not text:
        text = "trener"
    base = text
    i = 2
    while text in used:
        text = f"{base}-{i}"
        i += 1
    used.add(text)
    return text


def normalize(value: str) -> str:
    return " ".join((value or "").replace("\xa0", " ").strip().split())


def potential_score(row: dict) -> float:
    score = 0.0
    rating = normalize(row.get("Rating", "")).replace(",", ".")
    try:
        score += float(rating) * 10
    except ValueError:
        score += 45.0

    for key, weight in (
        ("Phone", 15),
        ("Website", 14),
        ("Instagram", 10),
        ("Facebook", 8),
        ("Email", 12),
    ):
        if normalize(row.get(key, "")):
            score += weight

    title = normalize(row.get("Title", "")).lower()
    category = normalize(row.get("Category", "")).lower()

    if "kobiet" in category:
        score += 2
    if "trener personalny" in title or "trener osobisty" in title:
        score += 3
    if "bydgoszcz" in title:
        score += 2

    return score


def extract_person_name(title: str) -> str:
    text = normalize(title)
    text = re.sub(
        r"(?i)^(trener personalny bydgoszcz|trener personalny|trenerka|trener biegania bydgoszcz|trener biegania)\s*[-|:]?\s*",
        "",
        text,
    )

    stop_words = {
        "trener",
        "personalny",
        "osobisty",
        "bydgoszcz",
        "studio",
        "treningu",
        "trening",
        "dla",
        "kobiet",
        "fizjoterapia",
        "rehabilitacja",
        "medyczny",
        "gym",
        "fit",
        "sport",
        "sports",
        "bioneuro",
        "klinika",
    }

    person_word = re.compile(r"^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+$")

    segments = [s.strip() for s in re.split(r"[|\-–—]", text) if s.strip()]
    for segment in segments + [text]:
        words = re.findall(r"[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]+", segment)
        words = [w for w in words if w.lower() not in stop_words]
        if len(words) >= 2:
            first, last = words[0], words[1]
            if (
                len(first) >= 2
                and len(last) >= 2
                and person_word.match(first)
                and person_word.match(last)
            ):
                return f"{first} {last}"

    return ""


def read_token() -> str:
    cfg = json.loads(MCP_CONFIG.read_text(encoding="utf-8"))
    env = cfg.get("mcpServers", {}).get("vercel-mcp", {}).get("env", {})
    token = (env.get("VERCEL_TOKEN", "") or env.get("VERCEL_ACCESS_TOKEN", "")).strip()
    if not token or token in {"YOUR_VERCEL_ACCESS_TOKEN", "YOUR_VERCEL_TOKEN"}:
        raise RuntimeError("Missing real Vercel token in mcp_config.json")
    return token


def run_cmd(
    args: list[str], *, input_text: str | None = None
) -> subprocess.CompletedProcess:
    return subprocess.run(
        VERCEL_CMD + args,
        cwd=str(ROOT),
        input=(input_text.encode("utf-8") if input_text is not None else None),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )


def detect_scope(token: str) -> str:
    req = urllib.request.Request(
        "https://api.vercel.com/v1/teams",
        headers={"Authorization": f"Bearer {token}", "Accept": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8", errors="ignore"))
    except Exception:
        return ""

    teams = data.get("teams") or []
    if not teams:
        return ""

    first = teams[0]
    return (first.get("slug") or "").strip()


def set_env(token: str, scope: str, value: str, environment: str) -> tuple[bool, str]:
    scope_args = ["--scope", scope] if scope else []
    update = run_cmd(
        [
            "env",
            "update",
            "VITE_CLIENT_SLUG",
            environment,
            "--token",
            token,
            "--non-interactive",
            *scope_args,
        ],
        input_text=value + "\n",
    )
    if update.returncode == 0:
        return True, "updated"

    add = run_cmd(
        [
            "env",
            "add",
            "VITE_CLIENT_SLUG",
            environment,
            "--token",
            token,
            "--non-interactive",
            *scope_args,
        ],
        input_text=value + "\n",
    )
    if add.returncode == 0:
        return True, "added"

    err = (update.stderr + add.stderr).decode("utf-8", errors="ignore")
    return False, err.strip()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Deploy next trainer wave to Vercel")
    parser.add_argument("--wave-name", default=DEFAULT_WAVE_NAME)
    parser.add_argument("--size", type=int, default=DEFAULT_WAVE_SIZE)
    return parser.parse_args()


def profile_name_is_person(slug: str) -> bool:
    profile_path = ROOT / "klienci" / slug / "profile.ts"
    if not profile_path.exists():
        return False

    text = profile_path.read_text(encoding="utf-8")
    m = re.search(r"fullName: '([^']*)'", text)
    full = (m.group(1) if m else "").strip()
    if not full:
        return False

    name_pat = re.compile(
        r"^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+\s+[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+$"
    )
    bad_tokens = {
        "studio",
        "gym",
        "fit",
        "dietetyk",
        "sports",
        "sport",
        "centrum",
        "trener",
        "personalny",
        "bydgoszcz",
        "bioneuro",
        "klinika",
    }
    if not name_pat.match(full):
        return False
    if any(tok in full.lower() for tok in bad_tokens):
        return False
    return True


def main() -> None:
    args = parse_args()
    log_csv = ROOT / f"{args.wave_name}_deploy_results.csv"

    token = read_token()
    scope = detect_scope(token)

    rows = list(csv.DictReader(FILTERED_CSV.open(encoding="utf-8-sig", newline="")))
    queue_rows = list(csv.DictReader(QUEUE_CSV.open(encoding="utf-8", newline="")))
    ready_slugs = {
        row.get("slug", "") for row in queue_rows if row.get("status") == "ready"
    }

    used = set()
    slug_by_title: dict[str, str] = {}
    for row in rows:
        title = normalize(row.get("Title", ""))
        slug_by_title[title] = slugify(title, used)

    person_rows = [
        row
        for row in rows
        if extract_person_name(row.get("Title", ""))
        and slug_by_title.get(normalize(row.get("Title", "")), "") in ready_slugs
        and profile_name_is_person(
            slug_by_title.get(normalize(row.get("Title", "")), "")
        )
    ]
    ranked = sorted(person_rows, key=potential_score, reverse=True)[: args.size]

    results: list[dict[str, str]] = []

    for row in ranked:
        title = normalize(row.get("Title", ""))
        slug = slug_by_title[title]
        project_name = f"trener-{slug}"

        link = run_cmd(
            [
                "link",
                "--project",
                project_name,
                "--yes",
                "--token",
                token,
                "--non-interactive",
                *(["--scope", scope] if scope else []),
            ]
        )
        if link.returncode != 0:
            results.append(
                {
                    "slug": slug,
                    "title": title,
                    "project": project_name,
                    "status": "failed_link",
                    "url": "",
                    "note": link.stderr.decode("utf-8", errors="ignore")[:500],
                }
            )
            continue

        env_notes = []
        env_ok = True
        for env_name in ("production", "preview", "development"):
            ok, note = set_env(token, scope, slug, env_name)
            env_notes.append(f"{env_name}:{note}")
            env_ok = env_ok and ok

        if not env_ok:
            results.append(
                {
                    "slug": slug,
                    "title": title,
                    "project": project_name,
                    "status": "failed_env",
                    "url": "",
                    "note": "; ".join(env_notes)[:500],
                }
            )
            continue

        deploy = run_cmd(
            [
                "deploy",
                "--prod",
                "--yes",
                "--token",
                token,
                "--non-interactive",
                *(["--scope", scope] if scope else []),
            ]
        )
        out = deploy.stdout.decode("utf-8", errors="ignore")
        err = deploy.stderr.decode("utf-8", errors="ignore")

        if deploy.returncode != 0:
            results.append(
                {
                    "slug": slug,
                    "title": title,
                    "project": project_name,
                    "status": "failed_deploy",
                    "url": "",
                    "note": (out + "\n" + err)[:500],
                }
            )
            continue

        url_match = re.findall(r"https://[\w.-]+\.vercel\.app", out + "\n" + err)
        url = url_match[-1] if url_match else ""
        results.append(
            {
                "slug": slug,
                "title": title,
                "project": project_name,
                "status": "deployed",
                "url": url,
                "note": "; ".join(env_notes),
            }
        )

    with log_csv.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=["slug", "title", "project", "status", "url", "note"],
        )
        writer.writeheader()
        writer.writerows(results)

    status_by_slug = {r["slug"]: r["status"] for r in results}
    for row in queue_rows:
        slug = row.get("slug", "")
        if slug in status_by_slug and status_by_slug[slug] == "deployed":
            row["status"] = "deployed"
    with QUEUE_CSV.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(
            f, fieldnames=["slug", "vercel_project", "env_VITE_CLIENT_SLUG", "status"]
        )
        writer.writeheader()
        writer.writerows(queue_rows)

    deployed = sum(1 for r in results if r["status"] == "deployed")
    print(f"{args.wave_name}_total={len(results)}")
    print(f"{args.wave_name}_deployed={deployed}")
    print(f"{args.wave_name}_failed={len(results) - deployed}")
    print(f"report={log_csv}")


if __name__ == "__main__":
    main()
