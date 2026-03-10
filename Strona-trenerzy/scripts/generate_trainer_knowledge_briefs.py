from __future__ import annotations

import csv
import re
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "outreach" / "new_deploy_with_email_full_profiles_26.csv"
OUT_MD = ROOT / "outreach" / "new_deploy_with_email_knowledge_26.md"


def parse_profile_field(slug: str, field: str) -> str:
    path = ROOT / "klienci" / slug / "profile.ts"
    if not path.exists():
        return ""
    text = path.read_text(encoding="utf-8", errors="ignore")
    match = re.search(rf"{re.escape(field)}:\s*'([^']*)'", text)
    return match.group(1).strip() if match else ""


def compact(value: str) -> str:
    return (value or "").replace("\r", " ").replace("\n", " ").strip()


def main() -> int:
    rows = list(csv.DictReader(SOURCE.open(encoding="utf-8", newline="")))
    now = datetime.now(timezone.utc).isoformat()

    lines: list[str] = []
    lines.append("# Wiedza o 26 trenerach (new_deploy + email)")
    lines.append("")
    lines.append(f"Generated UTC: {now}")
    lines.append(f"Liczba osob: {len(rows)}")
    lines.append("")
    lines.append(
        "Zakres: rodzaj trenera, problemy/quickwin, cala komunikacja outreach (mail/DM/telefon), linki."
    )
    lines.append("")

    for idx, row in enumerate(rows, 1):
        slug = compact(row.get("slug", ""))
        title = compact(row.get("title", ""))
        first_name = compact(row.get("first_name", ""))
        category = parse_profile_field(slug, "category")
        brand_tagline = parse_profile_field(slug, "brandTagline")
        city = parse_profile_field(slug, "city")

        lines.append(f"## {idx}. {title} ({slug})")
        lines.append("")
        lines.append("- **Identyfikacja:**")
        lines.append(f"  - Imie: {first_name}")
        lines.append(f"  - Email: {compact(row.get('email', ''))}")
        lines.append(f"  - Telefon: {compact(row.get('phone', ''))}")
        lines.append(f"  - Website: {compact(row.get('website', ''))}")
        lines.append(f"  - Facebook: {compact(row.get('facebook', ''))}")
        lines.append(f"  - Instagram: {compact(row.get('instagram', ''))}")
        lines.append("")
        lines.append("- **Rodzaj trenera / pozycjonowanie:**")
        lines.append(f"  - Kategoria (profil): {category}")
        lines.append(f"  - Tagline (profil): {brand_tagline}")
        lines.append(f"  - Miasto (profil): {city}")
        lines.append(f"  - Niche (research): {compact(row.get('niche', ''))}")
        lines.append(f"  - Confidence: {compact(row.get('confidence', ''))}")
        lines.append(f"  - Source type: {compact(row.get('source_type', ''))}")
        lines.append("")
        lines.append("- **Problemy / hipotezy (co poprawiamy):**")
        lines.append(f"  - Opener line: {compact(row.get('opener_line', ''))}")
        lines.append(f"  - Quick win: {compact(row.get('quick_win', ''))}")
        lines.append(f"  - Research notes: {compact(row.get('research_notes', ''))}")
        lines.append("")
        lines.append("- **Komunikacja (co o nim mowimy):**")
        lines.append(
            f"  - Tone recommendation: {compact(row.get('tone_recommendation', ''))}"
        )
        lines.append(f"  - Subject 1: {compact(row.get('subject_1', ''))}")
        lines.append(f"  - Subject alt 1: {compact(row.get('subject_alt_1', ''))}")
        lines.append(f"  - Email 1: {compact(row.get('email_1', ''))}")
        lines.append(
            f"  - Email 1 friendly: {compact(row.get('email_1_friendly', ''))}"
        )
        lines.append(f"  - Email 1 premium: {compact(row.get('email_1_premium', ''))}")
        lines.append(f"  - Email 1 direct: {compact(row.get('email_1_direct', ''))}")
        lines.append(f"  - Followup 1: {compact(row.get('followup_1', ''))}")
        lines.append(f"  - Followup 2: {compact(row.get('followup_2', ''))}")
        lines.append(f"  - Followup 3: {compact(row.get('followup_3', ''))}")
        lines.append(f"  - DM 1: {compact(row.get('dm_1', ''))}")
        lines.append(f"  - DM followup: {compact(row.get('dm_followup', ''))}")
        lines.append(f"  - Phone opening: {compact(row.get('phone_opening', ''))}")
        lines.append(f"  - CTA: {compact(row.get('cta', ''))}")
        lines.append(
            f"  - Playbook version: {compact(row.get('playbook_version', ''))}"
        )
        lines.append("")
        lines.append("- **Deploy / linki:**")
        lines.append(f"  - Vercel project: {compact(row.get('vercel_project', ''))}")
        lines.append(
            f"  - Vercel canonical: {compact(row.get('vercel_url_canonical', ''))}"
        )
        lines.append(
            f"  - Vercel playbook: {compact(row.get('vercel_url_playbook', ''))}"
        )
        lines.append(
            f"  - Vercel redeploy report: {compact(row.get('vercel_url_redeploy_report', ''))}"
        )
        lines.append(f"  - Project URL: {compact(row.get('project_url', ''))}")
        lines.append("")

    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"written {OUT_MD}")
    print(f"rows {len(rows)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
