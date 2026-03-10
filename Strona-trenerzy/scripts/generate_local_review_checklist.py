from __future__ import annotations

import csv
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / "reports"


def latest_copy_pack() -> Path:
    files = sorted(
        REPORTS.glob("email_trainers_copy_pack_*.csv"),
        key=lambda path: path.stat().st_mtime,
        reverse=True,
    )
    if not files:
        raise FileNotFoundError("No email_trainers_copy_pack_*.csv found in reports/")
    return files[0]


def run() -> None:
    source = latest_copy_pack()
    suffix = source.stem.replace("email_trainers_copy_pack_", "")
    target = REPORTS / f"email_trainers_local_review_{suffix}.md"

    with source.open("r", encoding="utf-8-sig", newline="") as fh:
        rows = list(csv.DictReader(fh))

    rows = sorted(rows, key=lambda row: row.get("slug", ""))

    lines: list[str] = []
    lines.append(f"# Local review checklist ({suffix})")
    lines.append("")
    lines.append("Scope: trainers with email updated locally, without Vercel deploy.")
    lines.append("")
    lines.append("Base app: http://localhost:5173")
    lines.append("CRM view: http://localhost:5173/crm")
    lines.append("")
    lines.append("## Links per trainer")
    lines.append("")

    for idx, row in enumerate(rows, start=1):
        slug = row.get("slug", "")
        title = row.get("title", "")
        url = f"http://localhost:5173/?trainer={slug}"
        lines.append(f"{idx}. {title} - {url}")
        lines.append(
            "   - source: "
            f"{row.get('detected_source_type', '')}"
            " | confidence: "
            f"{row.get('confidence', '')}"
            " | email: "
            f"{row.get('email_status', '')}"
        )
        lines.append(f"   - internal quick win: {row.get('quick_win', '')}")

    lines.append("")
    lines.append("## QA checklist per page")
    lines.append("- hero copy and CTA")
    lines.append("- about section alignment")
    lines.append("- value props (4 cards)")
    lines.append("- pricing packages and labels")
    lines.append("- FAQ relevance")
    lines.append("- lead magnet title/description")

    target.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"generated={target}")
    print(f"rows={len(rows)}")


if __name__ == "__main__":
    run()
