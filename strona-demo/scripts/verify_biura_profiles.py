from __future__ import annotations

import csv
import json
import re
import unicodedata
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Tuple
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup
from requests.packages.urllib3.exceptions import InsecureRequestWarning

requests.packages.urllib3.disable_warnings(InsecureRequestWarning)


ROOT = Path(__file__).resolve().parents[1]
INPUT_JSON = ROOT / "src" / "data" / "biura" / "biuroResearch.generated.json"
OUTPUT_MANUAL_TS = ROOT / "src" / "data" / "biura" / "biuroProfiles.manual.ts"
OUTPUT_REPORT_CSV = ROOT / "reports" / "biura_manual_verification.csv"
OUTPUT_REPORT_MD = ROOT / "reports" / "biura_manual_verification.md"
OUTPUT_CHECKLIST_CSV = ROOT / "reports" / "biura_content_checklist.csv"
OUTPUT_CHECKLIST_MD = ROOT / "reports" / "biura_content_checklist.md"

EMAIL_RE = re.compile(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}")
PHONE_RE = re.compile(r"(?:\+?48[\s\-]?)?(?:\d[\s\-]?){9,11}")
PRICE_RE = re.compile(
    r"(?:od\s*)?\d{2,6}(?:[\s\u00A0]\d{3})*(?:[.,]\d{1,2})?\s?(?:z[lł]|PLN|pln)",
    re.IGNORECASE,
)
PRICE_CONTEXT_RE = re.compile(
    r"(?:od\s*)?\d{2,6}(?:[\s\u00A0]\d{3})*(?:[.,]\d{1,2})?\s?(?:netto|brutto|/mies|miesięcznie|miesiecznie)",
    re.IGNORECASE,
)
PRICE_OD_RE = re.compile(
    r"od\s*\d{2,6}(?:[\s\u00A0]\d{3})*(?:[.,]\d{1,2})?",
    re.IGNORECASE,
)
IMAGE_URL_RE = re.compile(
    r"https?://[^\"'()\s]+?\.(?:png|jpe?g|webp|svg)", re.IGNORECASE
)
REL_IMAGE_URL_RE = re.compile(
    r"/(?:wp-content|assets|media|img|images)/[^\"'()\s]+?\.(?:png|jpe?g|webp|svg)",
    re.IGNORECASE,
)

GENERIC_EMAIL_DOMAINS = {
    "gmail.com",
    "wp.pl",
    "o2.pl",
    "interia.pl",
    "onet.pl",
    "outlook.com",
    "hotmail.com",
    "icloud.com",
    "yahoo.com",
    "proton.me",
    "protonmail.com",
}

ACCOUNTING_KEYWORDS = [
    "ksieg",
    "księg",
    "rachunk",
    "podat",
    "kadry",
    "zus",
    "ksef",
]

TEAM_MULTI_TOKENS = [
    "nasz zespol",
    "nasz zespol",
    "specjalisc",
    "specjaliści",
    "ksiegowi",
    "księgowi",
    "doradcy",
]

TEAM_SINGLE_TOKENS = [
    "nazywam sie",
    "nazywam się",
    "wlasciciel",
    "właściciel",
    "moja kancelaria",
    "moje biuro",
]

ONLINE_TOKENS = ["online", "zdaln", "remote", "na odleglosc", "na odległość"]
OFFLINE_TOKENS = ["biuro", "stacjonarn", "w siedzibie", "spotkanie"]

SUBPAGE_TOKENS = [
    "oferta",
    "uslugi",
    "usługi",
    "cennik",
    "o-nas",
    "o-nasz",
    "kontakt",
    "zespol",
    "zespol",
    "ksef",
]

BAD_IMAGE_TOKENS = [
    "logo",
    "logotyp",
    "favicon",
    "icon",
    "ikon",
    "ico",
    "sygnet",
    "partner",
    "cert",
    "badge",
    "cookie",
    "gdpr",
    "avatar",
    "mapa",
    "map",
    "marker",
]

TEAM_IMAGE_TOKENS = [
    "zespol",
    "zespol",
    "team",
    "o-nas",
    "wlasc",
    "właśc",
    "ksieg",
    "księg",
]
PHOTO_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".avif"}
SOCIAL_HOSTS = [
    "facebook.com",
    "instagram.com",
    "linkedin.com",
    "youtube.com",
    "x.com",
    "twitter.com",
]


@dataclass
class ImageCandidate:
    url: str
    label: str
    width: int
    height: int


@dataclass
class PageSnapshot:
    url: str
    title: str
    description: str
    h1: str
    text: str
    links: List[str]
    emails: List[str]
    phones: List[str]
    images: List[ImageCandidate]


def clean(value: str) -> str:
    return " ".join((value or "").replace("\u00a0", " ").strip().split())


def normalize_url(url: str) -> str:
    url = clean(url)
    if not url:
        return ""
    if url.startswith(("http://", "https://")):
        return url
    return f"https://{url}"


def normalize_phone(phone: str) -> str:
    digits = re.sub(r"\D", "", phone or "")
    if digits.startswith("48") and len(digits) >= 11:
        digits = digits[2:]
    if len(digits) >= 9:
        digits = digits[-9:]
    return digits


def sanitize_display_name(value: str) -> str:
    value = clean(value)
    value = re.sub(r"[^0-9A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż&'.,()\-/\s]", "", value)
    value = clean(value)
    value = value.strip("-.,")
    return value


def build_nav_name(display_name: str) -> str:
    if len(display_name) <= 34:
        return display_name
    shortened = display_name[:34]
    if " " in shortened:
        shortened = shortened.rsplit(" ", 1)[0]
    return f"{shortened}..."


def sanitize_tagline(value: str) -> str:
    value = clean(value)
    if not value:
        return ""
    value = EMAIL_RE.sub("", value)
    value = PHONE_RE.sub("", value)
    value = re.sub(r"\s{2,}", " ", value).strip(" -,:;")
    if len(value) > 190:
        value = value[:190]
        if " " in value:
            value = value.rsplit(" ", 1)[0]
        value = f"{value}."
    return value


def host_matches(host: str, domain: str) -> bool:
    return host == domain or host.endswith(f".{domain}")


def is_social_host(host: str) -> bool:
    normalized = host.lower().replace("www.", "")
    return any(host_matches(normalized, token) for token in SOCIAL_HOSTS)


def is_social_website(url: str) -> bool:
    host = urlparse(url).netloc.lower().replace("www.", "")
    return is_social_host(host)


def email_domain(email: str) -> str:
    candidate = clean(email).lower()
    if "@" not in candidate:
        return ""
    return candidate.split("@", 1)[1]


def infer_website_from_emails(emails: Iterable[str]) -> str:
    for candidate in emails:
        domain = email_domain(candidate)
        if not domain or domain in GENERIC_EMAIL_DOMAINS:
            continue
        if "." not in domain or domain.endswith(".local"):
            continue
        if is_social_host(domain):
            continue
        return f"https://{domain}"
    return ""


def normalize_social_url(raw: str) -> str:
    url = normalize_url(raw)
    if not url:
        return ""
    parsed = urlparse(url)
    host = parsed.netloc.lower().replace("www.", "")
    path = parsed.path.lower()

    if host_matches(host, "facebook.com") and any(
        token in path for token in ["/sharer", "/share", "/dialog", "/plugins/"]
    ):
        return ""

    if host_matches(host, "twitter.com") and "/intent/" in path:
        return ""

    if host_matches(host, "x.com") and "/intent/" in path:
        return ""

    return url


def extract_social_links(links: Iterable[str]) -> Dict[str, str]:
    result = {"facebook": "", "instagram": "", "linkedin": "", "youtube": ""}
    for raw in links:
        url = normalize_social_url(raw)
        if not url:
            continue
        host = urlparse(url).netloc.lower().replace("www.", "")
        if not result["facebook"] and host_matches(host, "facebook.com"):
            result["facebook"] = url
        if not result["instagram"] and host_matches(host, "instagram.com"):
            result["instagram"] = url
        if not result["linkedin"] and host_matches(host, "linkedin.com"):
            result["linkedin"] = url
        if not result["youtube"] and host_matches(host, "youtube.com"):
            result["youtube"] = url
    return result


def parse_emails(text: str) -> List[str]:
    seen = set()
    result: List[str] = []
    for item in EMAIL_RE.findall(text or ""):
        lowered = item.lower()
        if lowered in seen:
            continue
        seen.add(lowered)
        result.append(lowered)
    return result


def parse_phones(text: str) -> List[str]:
    seen = set()
    result: List[str] = []
    for match in PHONE_RE.findall(text or ""):
        digits = normalize_phone(match)
        if len(digits) < 9 or digits in seen:
            continue
        seen.add(digits)
        result.append(digits)
    return result


def parse_prices(text: str) -> List[str]:
    seen = set()
    prices: List[Tuple[float, str]] = []
    haystack = text or ""

    candidates: List[str] = []
    candidates.extend(match.group(0) for match in PRICE_RE.finditer(haystack))
    candidates.extend(match.group(0) for match in PRICE_CONTEXT_RE.finditer(haystack))
    candidates.extend(match.group(0) for match in PRICE_OD_RE.finditer(haystack))

    for candidate in candidates:
        raw = clean(
            candidate.replace("zl", "zł").replace("PLN", "zł").replace("pln", "zł")
        )
        if "zł" not in raw:
            raw = f"{raw} zł"
        digits = re.sub(r"[^0-9,.]", "", raw).replace(",", ".")
        try:
            value = float(digits)
        except ValueError:
            continue
        if value < 50 or value > 8000:
            continue
        key = f"{value:.2f}"
        if key in seen:
            continue
        seen.add(key)
        prices.append((value, raw))

    prices.sort(key=lambda item: item[0])
    return [item[1] for item in prices[:8]]


def parse_int(value: object) -> int:
    if value is None:
        return 0
    text = clean(str(value))
    if not text:
        return 0
    match = re.search(r"\d+", text)
    if not match:
        return 0
    try:
        return int(match.group(0))
    except ValueError:
        return 0


def request_page(
    session: requests.Session, url: str, timeout: int = 12
) -> Optional[PageSnapshot]:
    if not url:
        return None

    normalized_url = normalize_url(url)
    if not normalized_url:
        return None

    candidates = [normalized_url]
    if normalized_url.startswith("https://"):
        candidates.append(normalized_url.replace("https://", "http://", 1))
    elif normalized_url.startswith("http://"):
        candidates.append(normalized_url.replace("http://", "https://", 1))

    response = None
    soft_response = None
    for candidate in list(dict.fromkeys(candidates)):
        try:
            fetched = session.get(
                candidate,
                timeout=timeout,
                allow_redirects=True,
                verify=False,
            )
        except Exception:
            continue

        if fetched.status_code < 400:
            response = fetched
            break

        if fetched.status_code in {401, 403} and soft_response is None:
            soft_response = fetched

    if response is None:
        response = soft_response

    if response is None:
        return None

    soup = BeautifulSoup(response.text, "html.parser")
    title = clean(soup.title.get_text(" ", strip=True) if soup.title else "")
    description_tag = soup.find("meta", attrs={"name": "description"})
    description = clean(description_tag.get("content", "") if description_tag else "")
    h1_tag = soup.find("h1")
    h1 = clean(h1_tag.get_text(" ", strip=True) if h1_tag else "")

    links: List[str] = []
    for anchor in soup.find_all("a"):
        href = clean(anchor.get("href", ""))
        if not href:
            continue
        full = urljoin(response.url, href)
        if full.startswith(("http://", "https://")):
            links.append(full)

    text = clean(soup.get_text(" ", strip=True))

    emails = parse_emails(text)
    for anchor in soup.find_all("a"):
        href = clean(anchor.get("href", ""))
        if href.lower().startswith("mailto:"):
            emails.extend(parse_emails(href))
    emails = list(dict.fromkeys(emails))

    phones = parse_phones(text)
    for anchor in soup.find_all("a"):
        href = clean(anchor.get("href", ""))
        if href.lower().startswith("tel:"):
            phones.extend(parse_phones(href))
    phones = list(dict.fromkeys(phones))

    images: List[ImageCandidate] = []
    og_tag = soup.find("meta", attrs={"property": "og:image"}) or soup.find(
        "meta", attrs={"name": "og:image"}
    )
    if og_tag and og_tag.get("content"):
        images.append(
            ImageCandidate(
                url=urljoin(response.url, clean(og_tag["content"])),
                label="og:image",
                width=0,
                height=0,
            )
        )

    for image in soup.find_all("img"):
        src = clean(image.get("src", ""))
        if not src:
            continue
        if src.startswith("data:image/"):
            continue
        full_src = urljoin(response.url, src)
        class_value = image.get("class", [])
        class_str = (
            class_value if isinstance(class_value, str) else " ".join(class_value)
        )
        label = " ".join(
            [
                clean(image.get("alt", "")),
                clean(class_str),
                clean(image.get("id", "")),
            ]
        )
        images.append(
            ImageCandidate(
                url=full_src,
                label=label,
                width=parse_int(image.get("width")),
                height=parse_int(image.get("height")),
            )
        )

    raw_html = response.text or ""
    for index, match in enumerate(IMAGE_URL_RE.finditer(raw_html)):
        if index >= 120:
            break
        src = clean(match.group(0))
        if not src:
            continue
        images.append(
            ImageCandidate(
                url=src,
                label="html-ref",
                width=0,
                height=0,
            )
        )
    for index, match in enumerate(REL_IMAGE_URL_RE.finditer(raw_html)):
        if index >= 120:
            break
        src = clean(match.group(0))
        if not src:
            continue
        full_src = urljoin(response.url, src)
        images.append(
            ImageCandidate(
                url=full_src,
                label="html-rel-ref",
                width=0,
                height=0,
            )
        )

    return PageSnapshot(
        url=response.url,
        title=title,
        description=description,
        h1=h1,
        text=text,
        links=list(dict.fromkeys(links)),
        emails=emails,
        phones=phones,
        images=images,
    )


def candidate_subpages(home: PageSnapshot) -> List[str]:
    domain = urlparse(home.url).netloc.lower()
    selected: List[str] = []
    for link in home.links:
        parsed = urlparse(link)
        if parsed.netloc.lower() != domain:
            continue
        lowered = link.lower()
        if any(token in lowered for token in SUBPAGE_TOKENS):
            selected.append(link)
    return list(dict.fromkeys(selected))[:5]


def image_score(candidate: ImageCandidate, site_domain: str, mode: str) -> int:
    lowered_url = candidate.url.lower()
    lowered_label = candidate.label.lower()
    score = 0

    ext = Path(urlparse(lowered_url).path).suffix
    if ext in PHOTO_EXTS:
        score += 4
    if ext == ".svg":
        score -= 8

    if urlparse(lowered_url).netloc.lower() == site_domain:
        score += 2

    if candidate.width and candidate.height:
        area = candidate.width * candidate.height
        if area >= 250_000:
            score += 4
        elif area < 20_000:
            score -= 6
        ratio = candidate.width / max(candidate.height, 1)
        if mode == "hero" and 1.0 <= ratio <= 3.2:
            score += 1
        if mode == "team" and 0.55 <= ratio <= 1.8:
            score += 1

    if any(
        token in lowered_url or token in lowered_label for token in BAD_IMAGE_TOKENS
    ):
        score -= 7

    if mode == "team" and any(
        token in lowered_url or token in lowered_label for token in TEAM_IMAGE_TOKENS
    ):
        score += 4

    if mode == "hero" and any(
        token in lowered_url for token in ["hero", "baner", "banner", "header"]
    ):
        score += 3

    if mode == "hero" and any(
        token in lowered_url
        for token in ["slider", "slide", "o-firmie", "o-nas", "biuro", "office"]
    ):
        score += 1

    if any(token in lowered_url for token in ["stock", "placeholder", "dummy"]):
        score -= 2

    return score


def pick_image(pages: Iterable[PageSnapshot], mode: str) -> Tuple[str, int]:
    all_pages = list(pages)
    if not all_pages:
        return "", -999
    site_domain = urlparse(all_pages[0].url).netloc.lower()

    seen = set()
    best_url = ""
    best_score = -999
    for page in all_pages:
        for image in page.images:
            if image.url in seen:
                continue
            seen.add(image.url)
            score = image_score(image, site_domain, mode)
            if score > best_score:
                best_score = score
                best_url = image.url

    if best_score < 4:
        return "", best_score
    return best_url, best_score


def infer_team_type(text: str, current_value: str) -> str:
    lowered = text.lower()
    if any(token in lowered for token in TEAM_MULTI_TOKENS):
        return "wieloosobowe"
    if any(token in lowered for token in TEAM_SINGLE_TOKENS):
        if current_value == "wieloosobowe":
            return current_value
        return "jednoosobowe"
    return current_value


def infer_team_type_from_legal_name(legal_name: str, current_value: str) -> str:
    if current_value != "nieokreslone":
        return current_value

    lowered = legal_name.lower()
    if any(
        token in lowered
        for token in ["sp. z o.o", "sp z o o", "spółka", "s.a", "sp. k"]
    ):
        return "wieloosobowe"

    words = [
        token.strip(".,()\"'")
        for token in clean(legal_name).split()
        if token.strip(".,()\"'")
    ]
    person_like = [
        token
        for token in words
        if token[0].isupper()
        and token.lower() not in {"biuro", "rachunkowe", "kancelaria"}
    ]
    if len(person_like) >= 2:
        return "jednoosobowe"

    return current_value


def infer_service_model(text: str, current_value: str) -> str:
    lowered = text.lower()
    has_online = any(token in lowered for token in ONLINE_TOKENS)
    has_offline = any(token in lowered for token in OFFLINE_TOKENS)
    if has_online and has_offline:
        return "hybrydowo"
    if has_online:
        return "online"
    if has_offline:
        return "stacjonarnie"
    return current_value


def choose_best_email(
    current_email: str,
    site_emails: List[str],
    website: str,
) -> str:
    if not site_emails:
        return current_email

    current_email = clean(current_email).lower()
    if current_email and current_email in site_emails:
        return current_email

    host = urlparse(website).netloc.lower().replace("www.", "").split(":")[0]

    def score(email: str) -> int:
        value = email.lower()
        points = 0
        if host and host in value:
            points += 4
        if any(token in value for token in ["biuro@", "kontakt@", "office@"]):
            points += 2
        if any(token in value for token in ["noreply", "no-reply", "donotreply"]):
            points -= 5
        if any(token in value for token in ["wordpress", "admin@", "root@"]):
            points -= 2
        return points

    ranked = sorted(site_emails, key=score, reverse=True)
    return ranked[0]


def choose_tagline(current_tagline: str, pages: List[PageSnapshot]) -> str:
    candidates: List[str] = []
    for page in pages:
        if page.description:
            candidates.append(page.description)
        if page.h1 and 40 <= len(page.h1) <= 120:
            candidates.append(page.h1)

    for candidate in candidates:
        cleaned = sanitize_tagline(candidate)
        if 45 <= len(cleaned) <= 180:
            return cleaned

    cleaned_current = sanitize_tagline(current_tagline)
    return cleaned_current


def numeric_price(price: str) -> float:
    digits = re.sub(r"[^0-9,.]", "", clean(price)).replace(",", ".")
    try:
        return float(digits)
    except ValueError:
        return 0.0


def apply_prices_to_plans(
    pricing_plans: List[Dict[str, object]],
    prices: List[str],
) -> List[Dict[str, object]]:
    if not pricing_plans or not prices:
        return pricing_plans

    ordered = sorted(prices, key=numeric_price)
    selected = [ordered[0]]
    if len(ordered) >= 2:
        selected.append(ordered[len(ordered) // 2])
    else:
        selected.append(f"od {ordered[0].replace('od ', '')}")
    if len(ordered) >= 3:
        selected.append(ordered[-1])
    else:
        selected.append("wycena indywidualna")

    updated: List[Dict[str, object]] = []
    for idx, plan in enumerate(pricing_plans[:3]):
        patched = dict(plan)
        patched["price"] = selected[idx]
        updated.append(patched)
    return updated


def apply_prices_to_services(
    services: List[Dict[str, object]],
    prices: List[str],
) -> List[Dict[str, object]]:
    if not services or not prices:
        return services

    ordered = sorted(prices, key=numeric_price)
    updated: List[Dict[str, object]] = []
    for index, service in enumerate(services):
        patched = dict(service)
        if index < len(ordered):
            patched["priceHint"] = ordered[index]
        updated.append(patched)
    return updated


def extract_owner_name(display_name: str, legal_name: str) -> str:
    stop_tokens = {
        "biuro",
        "rachunkowe",
        "kancelaria",
        "sp",
        "z",
        "o",
        "oo",
        "spółka",
        "office",
        "accounting",
    }
    for source in [display_name, legal_name]:
        tokens = re.split(r"\s+", clean(source))
        candidate: List[str] = []
        for token in tokens:
            normalized = token.strip(".,()\"'").lower()
            if not normalized or normalized in stop_tokens:
                continue
            if any(ch.isdigit() for ch in normalized):
                continue
            if len(token) > 1 and token[0].isalpha() and token[0].isupper():
                candidate.append(token.strip(".,()\"'"))
            if len(candidate) >= 2:
                return " ".join(candidate[:2])
    return display_name


def build_team_entries(
    display_name: str,
    legal_name: str,
    team_type: str,
    team_image: str,
    hero_image: str,
) -> List[Dict[str, str]]:
    main_image = team_image or hero_image or "/images/team-marta.jpg"
    second_image = (
        hero_image
        if hero_image and hero_image != main_image
        else "/images/team-anna.jpg"
    )

    if team_type == "jednoosobowe":
        owner_name = extract_owner_name(display_name, legal_name)
        return [
            {
                "name": owner_name,
                "role": "Właściciel i opiekun współpracy",
                "experience": "Bezpośredni kontakt z klientami",
                "credentials": "Księgowość i podatki",
                "image": main_image,
                "objectPosition": "center 16%",
            }
        ]

    return [
        {
            "name": "Opiekun klienta",
            "role": f"Zespół {display_name}",
            "experience": "Stały kontakt operacyjny",
            "credentials": "Księgowość i podatki",
            "image": main_image,
            "objectPosition": "center 16%",
        },
        {
            "name": "Kadry i płace",
            "role": "Specjalista ds. HR i ZUS",
            "experience": "Obsługa dokumentów pracowniczych",
            "credentials": "Kadry, płace i ZUS",
            "image": second_image,
            "objectPosition": "center 14%",
        },
        {
            "name": "Doradztwo podatkowe",
            "role": "Ekspert podatkowy",
            "experience": "Wsparcie decyzji finansowych",
            "credentials": "Analizy podatkowe i compliance",
            "image": "/images/team-tomasz.jpg",
            "objectPosition": "center 14%",
        },
    ]


def contains_accounting_keywords(text: str) -> bool:
    lowered = text.lower()
    return any(token in lowered for token in ACCOUNTING_KEYWORDS)


def set_nested(target: Dict[str, object], key: str, value: object) -> None:
    if value in (None, "", [], {}):
        return
    target[key] = value


def update_nested(
    target: Dict[str, object], key: str, patch: Dict[str, object]
) -> None:
    patch = {k: v for k, v in patch.items() if v not in (None, "", [], {})}
    if not patch:
        return
    existing = target.get(key)
    if isinstance(existing, dict):
        existing.update(patch)
    else:
        target[key] = patch


def run() -> None:
    if not INPUT_JSON.exists():
        raise FileNotFoundError(f"Input file not found: {INPUT_JSON}")

    profiles: List[Dict[str, object]] = json.loads(
        INPUT_JSON.read_text(encoding="utf-8")
    )

    session = requests.Session()
    session.headers.update(
        {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            "Accept-Language": "pl-PL,pl;q=0.9,en;q=0.8",
        }
    )

    overrides: Dict[str, Dict[str, object]] = {}
    report_rows: List[Dict[str, str]] = []
    checklist_rows: List[Dict[str, str]] = []

    for index, profile in enumerate(profiles, start=1):
        slug = str(profile.get("slug", "")).strip()
        display_name = clean(str(profile.get("displayName", "")))
        legal_name = clean(str(profile.get("legalName", "")))

        original_website = normalize_url(str(profile.get("website", "")))
        current_email = clean(str(profile.get("email", ""))).lower()
        current_phone = clean(str(profile.get("phone", "")))
        current_team_type = clean(str(profile.get("teamType", "nieokreslone")))
        current_service_model = clean(str(profile.get("serviceModel", "nieokreslone")))

        current_emails: List[str] = []
        emails_obj = profile.get("emails", [])
        if isinstance(emails_obj, list):
            current_emails = [
                clean(str(item)).lower() for item in emails_obj if clean(str(item))
            ]
        if current_email and current_email not in current_emails:
            current_emails.append(current_email)

        website = original_website
        website_social_only = bool(website and is_social_website(website))
        inferred_website = infer_website_from_emails(current_emails)
        if (not website or website_social_only) and inferred_website:
            website = inferred_website
            website_social_only = False

        pages: List[PageSnapshot] = []
        issues: List[str] = []

        if website:
            home = request_page(session, website)
            if home:
                pages.append(home)
                for subpage in candidate_subpages(home):
                    page = request_page(session, subpage, timeout=10)
                    if page:
                        pages.append(page)
            else:
                issues.append("website_unreachable")
        elif original_website and is_social_website(original_website):
            issues.append("website_social_profile")
        else:
            issues.append("website_missing")

        site_text = " ".join(page.text for page in pages)
        site_prices = parse_prices(site_text)
        site_emails: List[str] = []
        site_phones: List[str] = []
        merged_links: List[str] = []
        for page in pages:
            site_emails.extend(page.emails)
            site_phones.extend(page.phones)
            merged_links.extend(page.links)
        site_emails = list(dict.fromkeys(site_emails))
        site_phones = list(dict.fromkeys(site_phones))
        merged_links = list(dict.fromkeys(merged_links))

        sanitized_display = sanitize_display_name(display_name)
        nav_name = build_nav_name(sanitized_display or display_name)
        tagline = choose_tagline(str(profile.get("tagline", "")), pages)
        inferred_team_type = infer_team_type(site_text, current_team_type)
        inferred_team_type = infer_team_type_from_legal_name(
            legal_name,
            inferred_team_type,
        )
        inferred_service_model = infer_service_model(site_text, current_service_model)
        best_email = choose_best_email(current_email, site_emails, website)
        best_phone = current_phone or (site_phones[0] if site_phones else "")
        hero_image, _ = pick_image(pages, mode="hero")
        team_image, _ = pick_image(pages, mode="team")
        if not hero_image and team_image:
            hero_image = team_image
        if not team_image and hero_image:
            team_image = hero_image

        media_obj = profile.get("media", {})
        current_team_image = ""
        current_logo_image = ""
        if isinstance(media_obj, dict):
            current_team_image = clean(str(media_obj.get("teamCandidateUrl", "")))
            current_logo_image = clean(str(media_obj.get("logoUrl", "")))

        logo_image = ""
        logo_score = -999
        for page in pages:
            for image in page.images:
                lowered = f"{image.url} {image.label}".lower()
                score = 0
                if any(token in lowered for token in ["logo", "logotyp", "brand"]):
                    score += 8
                if any(
                    token in lowered
                    for token in ["gdpr", "cookie", "favicon", "icon", "ikon"]
                ):
                    score -= 8
                ext = Path(urlparse(image.url).path).suffix.lower()
                if ext in {".svg", ".png", ".webp"}:
                    score += 2
                if score > logo_score:
                    logo_score = score
                    logo_image = image.url
        if logo_score < 4:
            logo_image = ""

        if not contains_accounting_keywords(site_text) and pages:
            issues.append("site_text_no_accounting_keywords")

        if not best_email:
            issues.append("email_missing")
        elif pages and site_emails and best_email not in site_emails:
            issues.append("email_not_seen_on_site")

        base_phone_norm = normalize_phone(current_phone)
        if not best_phone:
            issues.append("phone_missing")
        elif (
            pages
            and site_phones
            and base_phone_norm
            and base_phone_norm not in site_phones
        ):
            issues.append("phone_not_seen_on_site")

        base_hero = ""
        hero_obj = profile.get("hero", {})
        if isinstance(hero_obj, dict):
            base_hero = clean(str(hero_obj.get("image", "")))
        if not hero_image and base_hero.startswith("/images/hero-accountant"):
            issues.append("hero_image_fallback")

        override: Dict[str, object] = {}

        if website and website != original_website:
            set_nested(override, "website", website)

        if sanitized_display and sanitized_display != display_name:
            set_nested(override, "displayName", sanitized_display)
            update_nested(override, "hero", {"titleTop": sanitized_display})

        current_nav = clean(str(profile.get("navName", "")))
        if nav_name and nav_name != current_nav:
            set_nested(override, "navName", nav_name)

        current_tagline = clean(str(profile.get("tagline", "")))
        if tagline and tagline != current_tagline:
            set_nested(override, "tagline", tagline)
            update_nested(override, "hero", {"text": tagline})

        if best_email and best_email != current_email:
            set_nested(override, "email", best_email)

        merged_emails = list(dict.fromkeys([best_email] + current_emails + site_emails))
        merged_emails = [email for email in merged_emails if email]
        if merged_emails and merged_emails != current_emails:
            set_nested(override, "emails", merged_emails)

        if best_phone and best_phone != current_phone:
            set_nested(override, "phone", best_phone)

        if inferred_team_type and inferred_team_type != current_team_type:
            set_nested(override, "teamType", inferred_team_type)

        if inferred_service_model and inferred_service_model != current_service_model:
            set_nested(override, "serviceModel", inferred_service_model)

        if hero_image and hero_image != base_hero:
            update_nested(override, "hero", {"image": hero_image})
            update_nested(override, "media", {"heroCandidateUrl": hero_image})

        if team_image and team_image != current_team_image:
            update_nested(override, "media", {"teamCandidateUrl": team_image})

        if logo_image and logo_image != current_logo_image:
            update_nested(override, "media", {"logoUrl": logo_image})

        if site_prices:
            plans_obj = profile.get("pricingPlans", [])
            services_obj = profile.get("services", [])
            if isinstance(plans_obj, list):
                normalized_plans = [
                    item for item in plans_obj if isinstance(item, dict)
                ]
                updated_plans = apply_prices_to_plans(normalized_plans, site_prices)
                if updated_plans and updated_plans != normalized_plans:
                    set_nested(override, "pricingPlans", updated_plans)
            if isinstance(services_obj, list):
                normalized_services = [
                    item for item in services_obj if isinstance(item, dict)
                ]
                updated_services = apply_prices_to_services(
                    normalized_services,
                    site_prices,
                )
                if updated_services and updated_services != normalized_services:
                    set_nested(override, "services", updated_services)

        socials_obj = profile.get("socials", {})
        social_seed: List[str] = []
        if isinstance(socials_obj, dict):
            social_seed.extend(
                [clean(str(v)) for v in socials_obj.values() if clean(str(v))]
            )
        if original_website and is_social_website(original_website):
            social_seed.append(original_website)
        detected_socials = extract_social_links(merged_links + social_seed)
        if isinstance(socials_obj, dict):
            social_patch: Dict[str, object] = {
                key: value
                for key, value in detected_socials.items()
                if value and clean(str(socials_obj.get(key, ""))) != value
            }
            if social_patch:
                update_nested(override, "socials", social_patch)

        current_team_obj = profile.get("team", [])
        current_team_list = (
            [item for item in current_team_obj if isinstance(item, dict)]
            if isinstance(current_team_obj, list)
            else []
        )
        requires_team_override = False
        if inferred_team_type == "jednoosobowe":
            first_name = (
                clean(str(current_team_list[0].get("name", ""))).lower()
                if current_team_list
                else ""
            )
            requires_team_override = (
                not current_team_list
                or "zesp" in first_name
                or first_name in {"", "opiekun klienta"}
            )
        elif inferred_team_type == "wieloosobowe":
            requires_team_override = len(current_team_list) < 2

        if requires_team_override:
            team_for_override = build_team_entries(
                sanitized_display or display_name,
                legal_name,
                inferred_team_type,
                team_image or current_team_image,
                hero_image or base_hero,
            )
            set_nested(override, "team", team_for_override)

        if override:
            overrides[slug] = override

        status = "PASS"
        if "website_unreachable" in issues:
            status = "FAIL"
        elif issues:
            status = "WARN"

        resolved_hero = hero_image or base_hero
        resolved_logo = logo_image or current_logo_image
        resolved_team_image = team_image or current_team_image
        has_socials = any(value for value in detected_socials.values())

        report_rows.append(
            {
                "slug": slug,
                "displayName": sanitized_display or display_name,
                "status": status,
                "issues": ";".join(issues),
                "website": website,
                "pagesFetched": str(len(pages)),
                "email": best_email,
                "phone": best_phone,
                "teamType": inferred_team_type,
                "serviceModel": inferred_service_model,
                "heroImage": resolved_hero,
            }
        )

        if best_email:
            missing_fields: List[str] = []
            if not pages:
                missing_fields.append("website")
            if not best_phone:
                missing_fields.append("phone")
            if not resolved_hero or resolved_hero.startswith("/images/hero-accountant"):
                missing_fields.append("hero_photo")
            if not resolved_logo:
                missing_fields.append("logo")
            if not resolved_team_image:
                missing_fields.append("team_photo")
            if inferred_team_type not in {"jednoosobowe", "wieloosobowe"}:
                missing_fields.append("team_type")
            if not site_prices:
                missing_fields.append("pricing")
            if not has_socials:
                missing_fields.append("socials")

            checklist_rows.append(
                {
                    "slug": slug,
                    "displayName": sanitized_display or display_name,
                    "email": best_email,
                    "website": website,
                    "teamType": inferred_team_type,
                    "serviceModel": inferred_service_model,
                    "heroImage": resolved_hero,
                    "logoUrl": resolved_logo,
                    "teamImage": resolved_team_image,
                    "pricesFound": str(len(site_prices)),
                    "socialsFound": "yes" if has_socials else "no",
                    "status": "ready" if not missing_fields else "needs_review",
                    "missing": ",".join(missing_fields),
                }
            )

        print(f"[{index}/{len(profiles)}] {slug} -> {status}")

    ordered_overrides = {slug: overrides[slug] for slug in sorted(overrides)}

    OUTPUT_MANUAL_TS.parent.mkdir(parents=True, exist_ok=True)
    manual_content = (
        "import type { BiuroProfileOverride } from './biuroProfile';\n\n"
        "export const biuroProfilesManualOverrides: Record<string, BiuroProfileOverride> = "
        + json.dumps(ordered_overrides, ensure_ascii=False, indent=2)
        + ";\n"
    )
    OUTPUT_MANUAL_TS.write_text(manual_content, encoding="utf-8")

    OUTPUT_REPORT_CSV.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_REPORT_CSV.open("w", encoding="utf-8", newline="") as fp:
        fieldnames = [
            "slug",
            "displayName",
            "status",
            "issues",
            "website",
            "pagesFetched",
            "email",
            "phone",
            "teamType",
            "serviceModel",
            "heroImage",
        ]
        writer = csv.DictWriter(fp, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(report_rows)

    pass_count = sum(1 for row in report_rows if row["status"] == "PASS")
    warn_count = sum(1 for row in report_rows if row["status"] == "WARN")
    fail_count = sum(1 for row in report_rows if row["status"] == "FAIL")

    OUTPUT_REPORT_MD.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_REPORT_MD.open("w", encoding="utf-8") as fp:
        fp.write("# Biura Manual Verification Report\n\n")
        fp.write(f"- Profiles checked: **{len(report_rows)}**\n")
        fp.write(f"- PASS: **{pass_count}**\n")
        fp.write(f"- WARN: **{warn_count}**\n")
        fp.write(f"- FAIL: **{fail_count}**\n")
        fp.write(f"- Overrides generated: **{len(ordered_overrides)}**\n\n")

        fp.write("## FAIL\n")
        for row in report_rows:
            if row["status"] == "FAIL":
                fp.write(f"- `{row['slug']}` - {row['issues'] or 'no issues listed'}\n")

        fp.write("\n## WARN\n")
        for row in report_rows:
            if row["status"] == "WARN":
                fp.write(f"- `{row['slug']}` - {row['issues'] or 'no issues listed'}\n")

    checklist_sorted = sorted(
        checklist_rows,
        key=lambda row: (
            row["status"] != "ready",
            len([token for token in row["missing"].split(",") if token]),
            row["slug"],
        ),
    )

    OUTPUT_CHECKLIST_CSV.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_CHECKLIST_CSV.open("w", encoding="utf-8", newline="") as fp:
        fieldnames = [
            "slug",
            "displayName",
            "email",
            "website",
            "teamType",
            "serviceModel",
            "heroImage",
            "logoUrl",
            "teamImage",
            "pricesFound",
            "socialsFound",
            "status",
            "missing",
        ]
        writer = csv.DictWriter(fp, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(checklist_sorted)

    ready_count = sum(1 for row in checklist_sorted if row["status"] == "ready")
    review_count = len(checklist_sorted) - ready_count

    OUTPUT_CHECKLIST_MD.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_CHECKLIST_MD.open("w", encoding="utf-8") as fp:
        fp.write("# Biura Content Checklist (profiles with email)\n\n")
        fp.write(f"- Profiles with email: **{len(checklist_sorted)}**\n")
        fp.write(f"- Ready: **{ready_count}**\n")
        fp.write(f"- Needs review: **{review_count}**\n\n")

        fp.write("## Needs review\n")
        for row in checklist_sorted:
            if row["status"] != "needs_review":
                continue
            missing = row["missing"] or "n/a"
            fp.write(f"- `{row['slug']}` - missing: {missing}\n")

    print(f"Manual overrides written: {OUTPUT_MANUAL_TS}")
    print(f"CSV report written: {OUTPUT_REPORT_CSV}")
    print(f"Markdown report written: {OUTPUT_REPORT_MD}")
    print(f"Checklist CSV written: {OUTPUT_CHECKLIST_CSV}")
    print(f"Checklist Markdown written: {OUTPUT_CHECKLIST_MD}")
    print(f"PASS={pass_count} WARN={warn_count} FAIL={fail_count}")


if __name__ == "__main__":
    run()
