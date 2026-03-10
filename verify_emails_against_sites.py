import csv
import re
import time
from html import unescape
from pathlib import Path
from urllib.parse import unquote, urljoin, urlparse

import requests
import urllib3


urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

INPUT_PATH = Path("poznan/leady_unikalne_enriched.csv")
REPORT_PATH = Path("poznan/email_manual_verification_report.csv")

EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
HREF_RE = re.compile(r"href=[\"']([^\"']+)[\"']", re.IGNORECASE)
KEYWORDS = (
    "kontakt",
    "contact",
    "o-nas",
    "about",
    "team",
    "biuro",
    "ksieg",
)


def normalize_email(value: str) -> str:
    return unquote(value).strip().strip(".,;:()[]{}<>\"'").lower()


def normalize_website(url: str) -> str:
    value = (url or "").strip()
    if not value:
        return ""
    if not value.startswith(("http://", "https://")):
        value = "https://" + value
    return value


def extract_emails_from_html(html: str) -> set[str]:
    text = unescape(html or "")
    emails = {normalize_email(e) for e in EMAIL_RE.findall(text)}

    for raw in re.findall(r"mailto:([^\"'\s>]+)", text, flags=re.IGNORECASE):
        email = normalize_email(raw)
        if "@" in email:
            emails.add(email)

    return {e for e in emails if "@" in e}


def candidate_links(base_url: str, html: str) -> list[str]:
    links: list[str] = []
    base_host = (urlparse(base_url).hostname or "").lower()

    for href in HREF_RE.findall(html or ""):
        h = href.strip()
        if not h or h.startswith(("mailto:", "tel:", "javascript:")):
            continue
        absolute = urljoin(base_url, h)
        parsed = urlparse(absolute)
        host = (parsed.hostname or "").lower()
        if parsed.scheme not in {"http", "https"}:
            continue
        if host and host != base_host:
            continue
        path_l = (parsed.path or "").lower()
        if any(k in path_l for k in KEYWORDS):
            clean = parsed._replace(fragment="").geturl()
            if clean not in links:
                links.append(clean)

    for path in (
        "/kontakt",
        "/kontakt/",
        "/contact",
        "/contact-us",
        "/o-nas",
        "/about",
        "/zespol",
        "/team",
    ):
        url = urljoin(base_url, path)
        if url not in links:
            links.append(url)

    return links[:12]


def fetch_html(session: requests.Session, url: str) -> str:
    try:
        response = session.get(url, timeout=20, allow_redirects=True, verify=False)
        if response.status_code >= 400:
            return ""
        response.encoding = response.encoding or "utf-8"
        return response.text
    except requests.RequestException:
        return ""


def scan_site_for_emails(
    session: requests.Session, website: str
) -> tuple[set[str], list[str]]:
    base_url = normalize_website(website)
    if not base_url:
        return set(), []

    scanned_urls: list[str] = []
    found: set[str] = set()

    home = fetch_html(session, base_url)
    if not home:
        return set(), []

    scanned_urls.append(base_url)
    found |= extract_emails_from_html(home)

    for link in candidate_links(base_url, home):
        html = fetch_html(session, link)
        if not html:
            continue
        scanned_urls.append(link)
        found |= extract_emails_from_html(html)

    return found, scanned_urls


def main() -> None:
    rows = list(csv.DictReader(INPUT_PATH.open("r", encoding="utf-8", newline="")))

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
    total_rows_with_email = 0
    total_verified = 0
    total_unverified = 0

    for idx, row in enumerate(rows, start=1):
        email_field = (row.get("email") or "").strip()
        if not email_field:
            continue

        total_rows_with_email += 1

        claimed = []
        for part in [x.strip() for x in email_field.split("|") if x.strip()]:
            mail = normalize_email(part)
            if mail and mail not in claimed:
                claimed.append(mail)

        found, scanned = scan_site_for_emails(session, row.get("strona") or "")

        verified = [m for m in claimed if m in found]
        unverified = [m for m in claimed if m not in found]

        total_verified += len(verified)
        total_unverified += len(unverified)

        report_rows.append(
            {
                "imie": row.get("imie", ""),
                "strona": row.get("strona", ""),
                "claimed_email": " | ".join(claimed),
                "verified_email": " | ".join(verified),
                "unverified_email": " | ".join(unverified),
                "verified_count": str(len(verified)),
                "unverified_count": str(len(unverified)),
                "scanned_urls": " | ".join(scanned),
            }
        )

        if idx % 10 == 0:
            print(f"Przetworzono {idx}/{len(rows)}")
        time.sleep(0.2)

    with REPORT_PATH.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=[
                "imie",
                "strona",
                "claimed_email",
                "verified_email",
                "unverified_email",
                "verified_count",
                "unverified_count",
                "scanned_urls",
            ],
        )
        writer.writeheader()
        writer.writerows(report_rows)

    print(f"Rows with email: {total_rows_with_email}")
    print(f"Verified email values: {total_verified}")
    print(f"Unverified email values: {total_unverified}")
    print(f"Report: {REPORT_PATH}")


if __name__ == "__main__":
    main()
