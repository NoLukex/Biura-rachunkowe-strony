from __future__ import annotations

import csv
import json
import re
from copy import deepcopy
from pathlib import Path
from typing import Any, Dict, List
from urllib.error import HTTPError, URLError
from urllib.request import urlopen


ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = ROOT.parent

READY_CSV = REPO_ROOT / "Strona-trenerzy" / "data" / "poznan_biura_ready_pages_2026.csv"
GENERATED_JSON = ROOT / "src" / "data" / "biura" / "biuroResearch.generated.json"
MANUAL_TS = ROOT / "src" / "data" / "biura" / "biuroProfiles.manual.ts"
REPORT_CSV = ROOT / "reports" / "ready_pages_final_qa.csv"
REPORT_MD = ROOT / "reports" / "ready_pages_final_qa.md"

LEGAL_RE = re.compile(
    r"\b(sp\.?\s*z\.?\s*o\.?\s*o\.?|spolka|spółka|s\.?\s+a\.?|sp\.?k\.?|spolka\s+z\s+ograniczona)",
    re.IGNORECASE,
)

NON_PERSON_IMAGE_TOKENS = [
    "real-estate",
    "building",
    "biurow",
    "office",
    "nieruchom",
    "wnetrz",
    "interior",
    "logo",
    "icon",
    "banner",
    "stock",
    "dummy",
    "tax-office",
]


def clean(value: Any) -> str:
    return " ".join(str(value or "").strip().split())


def merge(base: Dict[str, Any], override: Dict[str, Any]) -> Dict[str, Any]:
    out = deepcopy(base)
    for key, value in (override or {}).items():
        if isinstance(value, dict) and isinstance(out.get(key), dict):
            out[key] = merge(out[key], value)
        else:
            out[key] = deepcopy(value)
    return out


def parse_manual_overrides() -> Dict[str, Dict[str, Any]]:
    raw = MANUAL_TS.read_text(encoding="utf-8")
    payload = raw.split("=", 1)[1].rsplit(";", 1)[0].strip()
    return json.loads(payload)


def is_person_image(url: str) -> bool:
    lowered = clean(url).lower()
    if not lowered:
        return False
    if lowered.endswith(".svg"):
        return False
    return not any(token in lowered for token in NON_PERSON_IMAGE_TOKENS)


def page_status(url: str) -> int:
    try:
        return urlopen(url, timeout=10).status
    except (HTTPError, URLError, TimeoutError):
        return 0


def main() -> None:
    ready_rows = list(csv.DictReader(READY_CSV.open("r", encoding="utf-8", newline="")))
    ready_slugs = [row["slug"] for row in ready_rows if row.get("status") == "ready"]

    generated_profiles = json.loads(GENERATED_JSON.read_text(encoding="utf-8"))
    generated_by_slug = {profile["slug"]: profile for profile in generated_profiles}
    manual_overrides = parse_manual_overrides()

    result_rows: List[Dict[str, str]] = []
    for slug in ready_slugs:
        base = generated_by_slug[slug]
        profile = merge(base, manual_overrides.get(slug, {}))

        display_name = clean(profile.get("displayName", ""))
        nav_name = clean(profile.get("navName", ""))
        hero_title = clean((profile.get("hero") or {}).get("titleTop", ""))
        hero_image = clean((profile.get("hero") or {}).get("image", ""))
        logo_url = clean((profile.get("media") or {}).get("logoUrl", ""))
        team = [item for item in (profile.get("team") or []) if isinstance(item, dict)]
        team_images = [clean(item.get("image", "")) for item in team]

        issues: List[str] = []
        if LEGAL_RE.search(display_name):
            issues.append("display_legal_suffix")
        if LEGAL_RE.search(nav_name):
            issues.append("nav_legal_suffix")
        if LEGAL_RE.search(hero_title):
            issues.append("hero_title_legal_suffix")
        if not is_person_image(hero_image):
            issues.append("hero_not_person_like")
        if not logo_url:
            issues.append("logo_missing")
        if len(team_images) >= 2 and len(set(team_images)) < len(team_images):
            issues.append("team_duplicate_images")
        if any(not is_person_image(image) for image in team_images):
            issues.append("team_nonperson_image")

        status_code = page_status(f"http://127.0.0.1:3000/?biuro={slug}")
        if status_code != 200:
            issues.append("page_http_not_200")

        result_rows.append(
            {
                "slug": slug,
                "status": "PASS" if not issues else "WARN",
                "http": str(status_code),
                "displayName": display_name,
                "heroImage": hero_image,
                "logoUrl": logo_url,
                "teamCount": str(len(team)),
                "issues": ";".join(issues),
            }
        )

    REPORT_CSV.parent.mkdir(parents=True, exist_ok=True)
    with REPORT_CSV.open("w", encoding="utf-8", newline="") as fp:
        fieldnames = [
            "slug",
            "status",
            "http",
            "displayName",
            "heroImage",
            "logoUrl",
            "teamCount",
            "issues",
        ]
        writer = csv.DictWriter(fp, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(result_rows)

    pass_count = sum(1 for row in result_rows if row["status"] == "PASS")
    warn_count = len(result_rows) - pass_count

    with REPORT_MD.open("w", encoding="utf-8") as fp:
        fp.write("# Ready Pages Final QA\n\n")
        fp.write(f"- Total pages checked: **{len(result_rows)}**\n")
        fp.write(f"- PASS: **{pass_count}**\n")
        fp.write(f"- WARN: **{warn_count}**\n\n")
        fp.write("## Results\n")
        for row in result_rows:
            issues_label = row["issues"] or "ok"
            fp.write(f"- `{row['slug']}` - {row['status']} ({issues_label})\n")

    print(f"PASS={pass_count} WARN={warn_count} TOTAL={len(result_rows)}")
    print(f"CSV={REPORT_CSV}")
    print(f"MD={REPORT_MD}")


if __name__ == "__main__":
    main()
