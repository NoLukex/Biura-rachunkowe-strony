from __future__ import annotations

import csv
import html
import json
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import parse_qs, unquote, urljoin, urlparse
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT.parent
PERSONAL_CSV = BASE / "trenerzy_bydgoszcz_personalni.csv"
QUEUE_CSV = ROOT / "clients_deploy_queue.csv"

OUTREACH_DIR = ROOT / "outreach"
REPORTS_DIR = ROOT / "reports"

ENRICH_REPORT = REPORTS_DIR / "email_enrichment_deployed_report.csv"

TIMEOUT = 8
MAX_WORKERS = 10
MAX_LINKS = 14
MAX_EXTERNAL_LINKS = 8

BAD_EMAIL_DOMAINS = {
    "payhip.com",
    "surecart.com",
    "example.com",
}

FREE_EMAIL_DOMAINS = {
    "gmail.com",
    "outlook.com",
    "hotmail.com",
    "live.com",
    "icloud.com",
    "wp.pl",
    "onet.pl",
    "o2.pl",
    "interia.pl",
    "proton.me",
    "protonmail.com",
}

BLACKLIST_EMAILS = {
    "kontakt@uodo.gov.pl",
    "porady@dlakonsumentow.pl",
}

MANUALLY_VERIFIED_SLUGS = {
    "dawid-cichanski",
    "maja-burek-trener-personalny",
    "forever-athlete-vincent-marek",
    "kaja-narkun",
    "maciej-karolczyk-trener-personalny",
    "mateusz-mazur",
    "mikolaj-karaszewski-fitness-lifestyle",
    "oskar-kaliszewski-trener-personalny",
    "patryk-kozikowski",
    "trener-personalny-szymon-idzinski",
    "trener-personalny-bydgoszcz-nicolas-marysiak",
    "trener-radoslaw-habera",
}

EMAIL_RE = re.compile(r"([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})", re.IGNORECASE)
MAILTO_RE = re.compile(r"mailto:([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})", re.IGNORECASE)
HREF_RE = re.compile(r"<a[^>]+href=[\"']([^\"']+)[\"']", re.IGNORECASE)

CONTACT_HINTS = (
    "kontakt",
    "contact",
    "o-nas",
    "about",
    "team",
    "polityka-prywatnosci",
)

SOCIAL_DOMAINS = {
    "facebook.com",
    "m.facebook.com",
    "instagram.com",
    "tiktok.com",
    "youtube.com",
}


def normalize(value: str | None) -> str:
    if not value:
        return ""
    return " ".join(value.replace("\xa0", " ").strip().split())


def normalize_url(value: str | None) -> str:
    value = normalize(value)
    if not value:
        return ""
    if not re.match(r"^https?://", value, re.IGNORECASE):
        value = "https://" + value
    return value


def normalize_candidate_url(value: str | None) -> str:
    value = normalize_url(value)
    if not value:
        return ""
    try:
        parsed = urlparse(value)
        host = parsed.netloc.lower()
        if host.startswith("www."):
            host = host[4:]
        if host in {"l.facebook.com", "lm.facebook.com"}:
            q = parse_qs(parsed.query)
            if q.get("u"):
                target = unquote(q["u"][0])
                return normalize_url(target)
    except Exception:
        return value
    return value


def domain_of(url: str) -> str:
    try:
        host = urlparse(url).netloc.lower()
        if host.startswith("www."):
            host = host[4:]
        return host
    except Exception:
        return ""


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
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-") or "trener"
    base = text
    i = 2
    while text in used:
        text = f"{base}-{i}"
        i += 1
    used.add(text)
    return text


def fetch_text(url: str) -> str:
    try:
        req = Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (compatible; TrainerEmailBot/2.0)",
                "Accept": "text/html,application/xhtml+xml",
            },
        )
        with urlopen(req, timeout=TIMEOUT) as resp:
            raw = resp.read(1_000_000)
            ctype = (resp.headers.get("Content-Type") or "").lower()
            charset = "utf-8"
            if "charset=" in ctype:
                charset = ctype.split("charset=")[-1].split(";")[0].strip()
            try:
                return raw.decode(charset, errors="ignore")
            except LookupError:
                return raw.decode("utf-8", errors="ignore")
    except Exception:
        return ""


def normalize_obfuscated(text: str) -> str:
    text = html.unescape(text)
    text = text.replace("[at]", "@").replace("(at)", "@").replace(" at ", " @ ")
    text = text.replace("[dot]", ".").replace("(dot)", ".").replace(" dot ", " . ")
    return text


def clean_email(email: str) -> str:
    return email.strip().strip(".,;:()[]{}<>").lower()


def valid_email(email: str) -> bool:
    if "@" not in email:
        return False
    if email in BLACKLIST_EMAILS:
        return False
    local, _, dom = email.partition("@")
    if not local or not dom or "." not in dom:
        return False
    if dom in BAD_EMAIL_DOMAINS or any(
        dom.endswith("." + d) for d in BAD_EMAIL_DOMAINS
    ):
        return False
    if any(
        email.endswith(ext)
        for ext in (".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif")
    ):
        return False
    return True


def extract_valid_email_candidates(raw_value: str | None) -> list[str]:
    text = normalize_obfuscated(raw_value or "")
    found = [clean_email(x) for x in EMAIL_RE.findall(text)]
    ordered = []
    seen = set()
    for email in found:
        if email in seen:
            continue
        seen.add(email)
        if valid_email(email):
            ordered.append(email)
    return ordered


def classify_email(email: str, website: str) -> tuple[str, str]:
    if not email:
        return "not_found", "missing_email"

    dom = email.partition("@")[2].lower()
    site_domain = domain_of(normalize_url(website))
    is_free = dom in FREE_EMAIL_DOMAINS or any(
        dom.endswith("." + d) for d in FREE_EMAIL_DOMAINS
    )

    if is_free:
        return "risky", "free_inbox_domain"

    if site_domain and (dom == site_domain or dom.endswith("." + site_domain)):
        return "verified", "matches_website_domain"

    if site_domain:
        return "risky", "domain_mismatch"

    return "risky", "no_website_domain"


def extract_emails(text: str) -> tuple[set[str], set[str]]:
    t = normalize_obfuscated(text)
    mailto = {clean_email(x) for x in MAILTO_RE.findall(t)}
    plain = {clean_email(x) for x in EMAIL_RE.findall(t)}
    mailto = {e for e in mailto if valid_email(e)}
    plain = {e for e in plain if valid_email(e)}
    return mailto, plain


def gather_links(base_url: str, text: str, site_domain: str) -> list[str]:
    links = []
    seen = set()

    for path in (
        "/kontakt",
        "/kontakt/",
        "/contact",
        "/o-nas",
        "/about",
        "/sitemap.xml",
    ):
        u = urljoin(base_url, path)
        if domain_of(u) == site_domain and u not in seen:
            seen.add(u)
            links.append(u)

    for href in HREF_RE.findall(text):
        low = href.lower()
        if not any(h in low for h in CONTACT_HINTS):
            continue
        u = urljoin(base_url, href)
        if domain_of(u) != site_domain:
            continue
        if u not in seen:
            seen.add(u)
            links.append(u)
        if len(links) >= MAX_LINKS:
            break

    return links[:MAX_LINKS]


def gather_external_links(base_url: str, text: str, site_domain: str) -> list[str]:
    links = []
    seen = set()

    for href in HREF_RE.findall(text):
        low = href.lower().strip()
        if not low or low.startswith(("mailto:", "tel:", "javascript:", "#")):
            continue

        u = normalize_candidate_url(urljoin(base_url, href))
        if not u:
            continue

        dom = domain_of(u)
        if not dom or dom == site_domain:
            continue
        if any(
            dom == social or dom.endswith("." + social) for social in SOCIAL_DOMAINS
        ):
            continue

        if u not in seen:
            seen.add(u)
            links.append(u)
        if len(links) >= MAX_EXTERNAL_LINKS:
            break

    return links[:MAX_EXTERNAL_LINKS]


def score_email(email: str, site_domain: str, is_mailto: bool) -> int:
    score = 0
    local, _, dom = email.partition("@")
    if is_mailto:
        score += 5
    if dom == site_domain or dom.endswith("." + site_domain):
        score += 4
    if local in {"kontakt", "contact", "biuro", "info", "office", "hello"}:
        score += 1
    if local in {"noreply", "no-reply"}:
        score -= 5
    return score


def find_email_from_website(
    website: str,
    *,
    allow_external_explore: bool = False,
    visited: set[str] | None = None,
) -> tuple[str, str, int]:
    website = normalize_candidate_url(website)
    if not website:
        return "", "", 0

    if visited is None:
        visited = set()
    if website in visited:
        return "", "", 0
    visited.add(website)

    site_domain = domain_of(website)
    if not site_domain:
        return "", "", 0

    home = fetch_text(website)
    if not home:
        return "", "", 0

    pages = [website] + gather_links(website, home, site_domain)

    candidates: list[tuple[str, str, bool]] = []
    seen = set()
    for page in pages:
        if page in seen:
            continue
        seen.add(page)
        text = home if page == website else fetch_text(page)
        if not text:
            continue
        mailto_hits, plain_hits = extract_emails(text)
        for e in mailto_hits:
            candidates.append((e, page, True))
        for e in plain_hits:
            candidates.append((e, page, False))

    best = ("", "", -10)
    for email, source, is_mailto in candidates:
        s = score_email(email, site_domain, is_mailto)
        if s > best[2]:
            best = (email, source, s)

    if allow_external_explore:
        ext_links = gather_external_links(website, home, site_domain)
        for link in ext_links:
            email, source, score = find_email_from_website(
                link,
                allow_external_explore=False,
                visited=visited,
            )
            if email and (score - 1) > best[2]:
                best = (email, source, score - 1)

    if best[2] <= 0:
        return "", "", 0
    return best


def process_entry(entry: dict) -> dict:
    source_urls = []
    for key in ("website", "facebook", "instagram"):
        v = normalize_candidate_url(entry.get(key, ""))
        if v and v not in source_urls:
            source_urls.append(v)

    if not source_urls:
        return {
            **entry,
            "website": "",
            "enriched_email": "",
            "source_page": "",
            "score": "0",
            "status": "no_sources",
        }

    best = ("", "", 0)
    for url in source_urls:
        email, source, score = find_email_from_website(
            url,
            allow_external_explore=True,
        )
        if score > best[2]:
            best = (email, source, score)

    email, source, score = best
    return {
        **entry,
        "website": source_urls[0] if source_urls else "",
        "enriched_email": email,
        "source_page": source,
        "score": str(score),
        "status": "added" if email else "not_found",
    }


def main() -> None:
    OUTREACH_DIR.mkdir(parents=True, exist_ok=True)
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)

    queue_rows = list(csv.DictReader(QUEUE_CSV.open(encoding="utf-8", newline="")))
    deployed_slugs = {r["slug"] for r in queue_rows if r.get("status") == "deployed"}

    source_rows = list(
        csv.DictReader(PERSONAL_CSV.open(encoding="utf-8-sig", newline=""))
    )

    used = set()
    rows_by_slug = {}
    for row in source_rows:
        title = normalize(row.get("Title") or row.get("\ufeffTitle") or "")
        slug = slugify(title, used)
        rows_by_slug[slug] = row

    targets = []
    for slug in sorted(deployed_slugs):
        row = rows_by_slug.get(slug)
        if not row:
            continue
        if normalize(row.get("Email", "")):
            continue
        targets.append(
            {
                "slug": slug,
                "title": normalize(row.get("Title") or row.get("\ufeffTitle") or ""),
                "website": normalize_url(row.get("Website", "")),
                "phone": normalize(row.get("Phone", "")),
                "facebook": normalize_url(row.get("Facebook", "")),
                "instagram": normalize_url(row.get("Instagram", "")),
            }
        )

    results = []
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as ex:
        futures = [ex.submit(process_entry, t) for t in targets]
        for fut in as_completed(futures):
            results.append(fut.result())

    by_slug_result = {r["slug"]: r for r in results}
    added = 0
    for slug in sorted(deployed_slugs):
        row = rows_by_slug.get(slug)
        if not row:
            continue
        if normalize(row.get("Email", "")):
            continue
        result = by_slug_result.get(slug)
        if result and result.get("enriched_email"):
            row["Email"] = result["enriched_email"]
            added += 1

    fieldnames = list(source_rows[0].keys()) if source_rows else []
    with PERSONAL_CSV.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(source_rows)

    with ENRICH_REPORT.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=[
                "slug",
                "title",
                "website",
                "phone",
                "facebook",
                "instagram",
                "enriched_email",
                "source_page",
                "score",
                "status",
            ],
        )
        writer.writeheader()
        writer.writerows(sorted(results, key=lambda x: x["slug"]))

    deployed_contacts = []
    missing_after = 0
    for slug in sorted(deployed_slugs):
        row = rows_by_slug.get(slug)
        if not row:
            continue
        raw_email = normalize(row.get("Email", ""))
        email_candidates = extract_valid_email_candidates(raw_email)
        email = email_candidates[0] if email_candidates else ""
        email_status, email_reason = classify_email(email, row.get("Website", ""))
        if slug in MANUALLY_VERIFIED_SLUGS and email:
            email_status = "verified"
            email_reason = "manual_verified"
        if not email:
            missing_after += 1
        elif len(email_candidates) > 1:
            email_reason = f"{email_reason};multiple_candidates"

        deployed_contacts.append(
            {
                "slug": slug,
                "title": normalize(row.get("Title") or row.get("\ufeffTitle") or ""),
                "raw_email": raw_email,
                "email": email,
                "email_status": email_status,
                "email_status_reason": email_reason,
                "phone": normalize(row.get("Phone", "")),
                "website": normalize_url(row.get("Website", "")),
                "facebook": normalize_url(row.get("Facebook", "")),
                "instagram": normalize_url(row.get("Instagram", "")),
            }
        )

    with (OUTREACH_DIR / "deployed_contacts.csv").open(
        "w", encoding="utf-8", newline=""
    ) as f:
        writer = csv.DictWriter(
            f,
            fieldnames=[
                "slug",
                "title",
                "raw_email",
                "email",
                "email_status",
                "email_status_reason",
                "phone",
                "website",
                "facebook",
                "instagram",
            ],
        )
        writer.writeheader()
        writer.writerows(deployed_contacts)

    with (OUTREACH_DIR / "email_enrichment_queue.csv").open(
        "w", encoding="utf-8", newline=""
    ) as f:
        writer = csv.DictWriter(
            f,
            fieldnames=["slug", "title", "phone", "website", "facebook", "instagram"],
        )
        writer.writeheader()
        for row in deployed_contacts:
            if not row["email"]:
                writer.writerow(
                    {
                        "slug": row["slug"],
                        "title": row["title"],
                        "phone": row["phone"],
                        "website": row["website"],
                        "facebook": row["facebook"],
                        "instagram": row["instagram"],
                    }
                )

    for status in ("verified", "risky", "not_found"):
        output = OUTREACH_DIR / f"deployed_contacts_{status}.csv"
        with output.open("w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(
                f,
                fieldnames=[
                    "slug",
                    "title",
                    "raw_email",
                    "email",
                    "email_status",
                    "email_status_reason",
                    "phone",
                    "website",
                    "facebook",
                    "instagram",
                ],
            )
            writer.writeheader()
            for row in deployed_contacts:
                if row["email_status"] == status:
                    writer.writerow(row)

    with (OUTREACH_DIR / "deployed_contacts_send_now.csv").open(
        "w", encoding="utf-8", newline=""
    ) as f:
        writer = csv.DictWriter(
            f,
            fieldnames=[
                "slug",
                "title",
                "raw_email",
                "email",
                "email_status",
                "email_status_reason",
                "phone",
                "website",
                "facebook",
                "instagram",
            ],
        )
        writer.writeheader()
        for row in deployed_contacts:
            if row["email_status"] in {"verified", "risky"}:
                writer.writerow(row)

    print(f"targets_missing_before={len(targets)}")
    print(f"emails_added={added}")
    print(f"targets_missing_after={missing_after}")
    print(f"report={ENRICH_REPORT}")


if __name__ == "__main__":
    main()
