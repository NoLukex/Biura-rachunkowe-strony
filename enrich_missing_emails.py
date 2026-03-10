import csv
import re
import time
from html import unescape
from urllib.parse import unquote, urljoin, urlparse

import requests


INPUT_PATH = "poznan/leady_unikalne_clean.csv"
OUTPUT_PATH = "poznan/leady_unikalne_enriched.csv"
FOUND_PATH = "poznan/missing_email_found.csv"
NOT_FOUND_PATH = "poznan/missing_email_not_found.csv"

EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
HREF_RE = re.compile(r"href=[\"']([^\"']+)[\"']", re.IGNORECASE)
KEYWORDS = ("kontakt", "contact", "o-nas", "about", "firma", "biuro")
FREE_EMAIL_DOMAINS = {
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
}


def normalize_website(url: str) -> str:
    value = (url or "").strip()
    if not value:
        return ""
    if not value.startswith(("http://", "https://")):
        value = "https://" + value
    return value


def normalize_email(value: str) -> str:
    return unquote(value).strip().strip(".,;:()[]{}<>\"'").lower()


def is_valid_email(value: str) -> bool:
    if not value or "@" not in value:
        return False
    if any(
        value.endswith(ext)
        for ext in (".png", ".jpg", ".jpeg", ".webp", ".svg", ".css", ".js")
    ):
        return False
    local, _, domain = value.partition("@")
    if not local or not domain or "." not in domain:
        return False
    if local in {"noreply", "no-reply", "donotreply"}:
        return False
    if domain in {"example.com", "example.org", "example.net"}:
        return False
    return True


def extract_emails(html_text: str) -> list[str]:
    emails: list[str] = []
    text = unescape(html_text or "")
    for raw in EMAIL_RE.findall(text):
        email = normalize_email(raw)
        if is_valid_email(email) and email not in emails:
            emails.append(email)
    return emails


def registrable_domain(host: str) -> str:
    parts = (host or "").lower().split(".")
    if len(parts) >= 2:
        return ".".join(parts[-2:])
    return host.lower()


def relevant_for_website(email: str, website: str) -> bool:
    domain = email.split("@", 1)[1].lower()
    if domain in FREE_EMAIL_DOMAINS:
        return True
    site_host = (urlparse(normalize_website(website)).hostname or "").lower()
    if not site_host:
        return True
    if domain == site_host:
        return True
    if domain.endswith("." + site_host):
        return True
    return registrable_domain(domain) == registrable_domain(site_host)


def extract_candidate_links(base_url: str, html_text: str) -> list[str]:
    links: list[str] = []
    base = urlparse(base_url)
    for href in HREF_RE.findall(html_text or ""):
        href = href.strip()
        if not href or href.startswith(("mailto:", "tel:", "javascript:")):
            continue
        absolute = urljoin(base_url, href)
        parsed = urlparse(absolute)
        if parsed.scheme not in {"http", "https"}:
            continue
        if parsed.netloc and parsed.netloc != base.netloc:
            continue
        path_l = (parsed.path or "").lower()
        if any(k in path_l for k in KEYWORDS):
            url = parsed._replace(fragment="").geturl()
            if url not in links:
                links.append(url)
    for common in ("/kontakt", "/kontakt/", "/contact", "/contact-us", "/o-nas"):
        url = urljoin(base_url, common)
        if url not in links:
            links.append(url)
    return links[:8]


def fetch(session: requests.Session, url: str) -> str:
    try:
        response = session.get(url, timeout=15, allow_redirects=True)
        if response.status_code >= 400:
            return ""
        response.encoding = response.encoding or "utf-8"
        return response.text
    except requests.RequestException:
        return ""


def find_emails_for_site(
    session: requests.Session, website: str
) -> tuple[list[str], str]:
    website = normalize_website(website)
    if not website:
        return [], ""

    home_html = fetch(session, website)
    if not home_html:
        return [], ""

    emails = [e for e in extract_emails(home_html) if relevant_for_website(e, website)]
    if emails:
        return emails, website

    for link in extract_candidate_links(website, home_html):
        sub_html = fetch(session, link)
        if not sub_html:
            continue
        sub_emails = [
            e for e in extract_emails(sub_html) if relevant_for_website(e, website)
        ]
        if sub_emails:
            return sub_emails, link
    return [], ""


def main() -> None:
    with open(INPUT_PATH, "r", encoding="utf-8", newline="") as f:
        rows = list(csv.DictReader(f))

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

    found_rows: list[dict[str, str]] = []
    not_found_rows: list[dict[str, str]] = []

    for idx, row in enumerate(rows, start=1):
        if (row.get("email") or "").strip():
            continue

        website = row.get("strona") or ""
        emails, source = find_emails_for_site(session, website)

        if emails:
            row["email"] = " | ".join(emails)
            found_rows.append(
                {
                    "imie": row.get("imie", ""),
                    "strona": website,
                    "email": row["email"],
                    "confidence": "high",
                    "source": source,
                }
            )
        else:
            not_found_rows.append(
                {
                    "imie": row.get("imie", ""),
                    "strona": website,
                }
            )

        if idx % 10 == 0:
            print(f"Przetworzono {idx}/{len(rows)}")
        time.sleep(0.25)

    with open(OUTPUT_PATH, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)

    with open(FOUND_PATH, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(
            f, fieldnames=["imie", "strona", "email", "confidence", "source"]
        )
        writer.writeheader()
        writer.writerows(found_rows)

    with open(NOT_FOUND_PATH, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["imie", "strona"])
        writer.writeheader()
        writer.writerows(not_found_rows)

    print(f"Znaleziono email dla: {len(found_rows)}")
    print(f"Nadal bez emaila: {len(not_found_rows)}")
    print(f"Zapisano: {OUTPUT_PATH}, {FOUND_PATH}, {NOT_FOUND_PATH}")


if __name__ == "__main__":
    main()
