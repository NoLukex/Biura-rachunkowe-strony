import csv
import re
import shutil
import time
from html import unescape
from pathlib import Path
from urllib.parse import unquote, urljoin, urlparse

import requests
import urllib3


urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

INPUT_PATH = Path("poznan/leady_unikalne_enriched.csv")
BACKUP_PATH = Path("poznan/leady_unikalne_enriched_backup_before_manual_verify.csv")
OUTPUT_PATH = Path("poznan/leady_unikalne_enriched.csv")
REPORT_PATH = Path("poznan/manual_verify_cleanup_report.csv")

EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
HREF_RE = re.compile(r"href=[\"']([^\"']+)[\"']", re.IGNORECASE)


def normalize_email(value: str) -> str:
    return unquote(value).strip().strip(".,;:()[]{}<>\"'").lower()


def normalize_website(url: str) -> str:
    value = (url or "").strip()
    if not value:
        return ""
    if not value.startswith(("http://", "https://")):
        value = "https://" + value
    return value


def extract_emails(html: str) -> set[str]:
    text = unescape(html or "")
    emails = {normalize_email(e) for e in EMAIL_RE.findall(text)}
    for raw in re.findall(r"mailto:([^\"'\s>]+)", text, flags=re.IGNORECASE):
        email = normalize_email(raw)
        if "@" in email:
            emails.add(email)
    return {e for e in emails if "@" in e}


def crawl_links(base_url: str, html: str) -> list[str]:
    links: list[str] = []
    base_host = (urlparse(base_url).hostname or "").lower()

    for href in HREF_RE.findall(html or ""):
        h = href.strip()
        if not h or h.startswith(("mailto:", "tel:", "javascript:", "#")):
            continue
        absolute = urljoin(base_url, h)
        parsed = urlparse(absolute)
        host = (parsed.hostname or "").lower()
        if parsed.scheme not in {"http", "https"}:
            continue
        if host != base_host:
            continue
        clean = parsed._replace(fragment="").geturl()
        if clean not in links:
            links.append(clean)

    return links


def fetch(session: requests.Session, url: str) -> str:
    try:
        response = session.get(url, timeout=20, allow_redirects=True, verify=False)
        if response.status_code >= 400:
            return ""
        response.encoding = response.encoding or "utf-8"
        return response.text
    except requests.RequestException:
        return ""


def site_emails(
    session: requests.Session, website: str, limit: int = 30
) -> tuple[set[str], int]:
    start = normalize_website(website)
    if not start:
        return set(), 0

    queue = [start]
    seen: set[str] = set()
    found: set[str] = set()
    pages = 0

    while queue and pages < limit:
        url = queue.pop(0)
        if url in seen:
            continue
        seen.add(url)

        html = fetch(session, url)
        if not html:
            continue

        pages += 1
        found |= extract_emails(html)

        for link in crawl_links(url, html):
            if link not in seen and link not in queue:
                queue.append(link)

    return found, pages


def main() -> None:
    rows = list(csv.DictReader(INPUT_PATH.open("r", encoding="utf-8", newline="")))
    fieldnames = list(rows[0].keys())

    shutil.copy2(INPUT_PATH, BACKUP_PATH)

    session = requests.Session()
    session.headers.update(
        {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/123.0.0.0 Safari/537.36"
            )
        }
    )

    report_rows: list[dict[str, str]] = []
    before_values = 0
    after_values = 0

    for idx, row in enumerate(rows, start=1):
        email_field = (row.get("email") or "").strip()
        if not email_field:
            continue

        claimed: list[str] = []
        for part in [x.strip() for x in email_field.split("|") if x.strip()]:
            mail = normalize_email(part)
            if mail and mail not in claimed:
                claimed.append(mail)

        found, scanned_pages = site_emails(session, row.get("strona") or "", limit=30)
        verified = [m for m in claimed if m in found]
        removed = [m for m in claimed if m not in found]

        before_values += len(claimed)
        after_values += len(verified)
        row["email"] = " | ".join(verified)

        if removed:
            report_rows.append(
                {
                    "imie": row.get("imie", ""),
                    "strona": row.get("strona", ""),
                    "kept_email": row.get("email", ""),
                    "removed_unverified_email": " | ".join(removed),
                    "pages_scanned": str(scanned_pages),
                }
            )

        if idx % 10 == 0:
            print(f"Przetworzono {idx}/{len(rows)}")
        time.sleep(0.1)

    with OUTPUT_PATH.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    with REPORT_PATH.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=[
                "imie",
                "strona",
                "kept_email",
                "removed_unverified_email",
                "pages_scanned",
            ],
        )
        writer.writeheader()
        writer.writerows(report_rows)

    print(f"Backup: {BACKUP_PATH}")
    print(f"Report: {REPORT_PATH}")
    print(f"Email values before: {before_values}")
    print(f"Email values after manual verification: {after_values}")


if __name__ == "__main__":
    main()
