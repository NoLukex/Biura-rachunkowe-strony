import csv
import re
from pathlib import Path


SRC = Path("poznan/leady_unikalne.csv")
DST = Path("poznan/leady_unikalne_clean.csv")

EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
SOCIAL_COLS = [
    "social/facebook/0",
    "social/instagram/0",
    "social/linkedin/0",
    "social/twitter/0",
    "social/youtube/0",
]
OUT_FIELDS = ["imie", "numer", "strona", "social_media", "ulica", "email", "url"]


def unique_emails(row: dict[str, str]) -> str:
    emails: list[str] = []
    for key, value in row.items():
        if not value:
            continue
        key_lower = (key or "").lower()
        if "email" in key_lower or "@" in value:
            for match in EMAIL_RE.findall(value):
                mail = match.lower()
                if mail not in emails:
                    emails.append(mail)
    return " | ".join(emails)


def unique_socials(row: dict[str, str]) -> str:
    socials: list[str] = []
    for col in SOCIAL_COLS:
        value = (row.get(col) or "").strip()
        if value and value not in socials:
            socials.append(value)
    return " | ".join(socials)


def main() -> None:
    output_rows: list[dict[str, str]] = []

    with SRC.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            street = (row.get("street") or "").strip() or (
                row.get("address") or ""
            ).strip()
            output_rows.append(
                {
                    "imie": (row.get("name") or "").strip(),
                    "numer": (row.get("phone") or row.get("phoneIsd") or "").strip(),
                    "strona": (row.get("website") or "").strip(),
                    "social_media": unique_socials(row),
                    "ulica": street,
                    "email": unique_emails(row),
                    "url": (row.get("url") or "").strip(),
                }
            )

    with DST.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=OUT_FIELDS)
        writer.writeheader()
        writer.writerows(output_rows)

    print(f"OK: zapisano {len(output_rows)} wierszy do {DST}")


if __name__ == "__main__":
    main()
