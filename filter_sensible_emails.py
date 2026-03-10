import csv
import re
import shutil
from pathlib import Path
from urllib.parse import unquote, urlparse


INPUT_PATH = Path("poznan/leady_unikalne_enriched.csv")
BACKUP_PATH = Path("poznan/leady_unikalne_enriched_backup_before_sensible.csv")
OUTPUT_PATH = Path("poznan/leady_unikalne_enriched.csv")
REPORT_PATH = Path("poznan/email_filter_report.csv")

EMAIL_RE = re.compile(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")

FREE_DOMAINS = {
    "gmail.com",
    "wp.pl",
    "o2.pl",
    "onet.pl",
    "interia.pl",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "icloud.com",
    "proton.me",
    "protonmail.com",
    "tlen.pl",
    "op.pl",
}

SUSPICIOUS_KEYWORDS = (
    "sentry",
    "wixpress",
    "noreply",
    "no-reply",
    "donotreply",
    "errorsfilters@certyficate.it",
)

# Ręcznie zweryfikowane wyjątki: kontaktowe domeny inne niż domena strony.
MANUAL_ALLOWED_BY_HOST = {
    "uslugiksiegowepoznan.pl": {"amkancelaria.info.pl"},
}


def is_free_domain(domain: str) -> bool:
    return any(domain == d or domain.endswith("." + d) for d in FREE_DOMAINS)


def normalize_email(value: str) -> str:
    return unquote(value).strip().strip(".,;:()[]{}<>\"'").lower()


def is_company_domain(domain: str, host: str) -> bool:
    if not host:
        return False
    return domain == host or domain.endswith("." + host) or host.endswith("." + domain)


def host_from_url(website: str) -> str:
    value = (website or "").strip()
    if not value:
        return ""
    if not value.startswith(("http://", "https://")):
        value = "https://" + value
    return (urlparse(value).hostname or "").lower()


def main() -> None:
    rows = list(csv.DictReader(INPUT_PATH.open("r", encoding="utf-8", newline="")))
    fieldnames = list(rows[0].keys())

    shutil.copy2(INPUT_PATH, BACKUP_PATH)

    report_rows: list[dict[str, str]] = []
    total_before = 0
    total_after = 0

    for row in rows:
        original_field = (row.get("email") or "").strip()
        if not original_field:
            continue

        original: list[str] = []
        for raw in [x.strip() for x in original_field.split("|") if x.strip()]:
            email = normalize_email(raw)
            if email and email not in original:
                original.append(email)

        host = host_from_url(row.get("strona") or "")
        manual_allowed = MANUAL_ALLOWED_BY_HOST.get(host, set())

        company_or_manual: list[str] = []
        free_fallback: list[str] = []
        removed: list[str] = []

        for email in original:
            if not EMAIL_RE.match(email):
                removed.append(email)
                continue

            if any(k in email for k in SUSPICIOUS_KEYWORDS):
                removed.append(email)
                continue

            domain = email.split("@", 1)[1]

            if domain in manual_allowed or is_company_domain(domain, host):
                if email not in company_or_manual:
                    company_or_manual.append(email)
                continue

            if is_free_domain(domain):
                if email not in free_fallback:
                    free_fallback.append(email)
                continue

            removed.append(email)

        kept = company_or_manual if company_or_manual else free_fallback
        row["email"] = " | ".join(kept)

        total_before += len(original)
        total_after += len(kept)

        if removed or len(original) != len(kept):
            report_rows.append(
                {
                    "imie": row.get("imie", ""),
                    "strona": row.get("strona", ""),
                    "kept_email": row.get("email", ""),
                    "removed_email": " | ".join(removed),
                }
            )

    with OUTPUT_PATH.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    with REPORT_PATH.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=["imie", "strona", "kept_email", "removed_email"],
        )
        writer.writeheader()
        writer.writerows(report_rows)

    print(f"Backup: {BACKUP_PATH}")
    print(f"Report: {REPORT_PATH}")
    print(f"Email values before: {total_before}")
    print(f"Email values after: {total_after}")


if __name__ == "__main__":
    main()
