from __future__ import annotations

import csv
import json
import re
import unicodedata
from collections import Counter
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Tuple
from urllib.parse import quote_plus, urljoin, urlparse

import requests
from bs4 import BeautifulSoup
from requests.packages.urllib3.exceptions import InsecureRequestWarning

requests.packages.urllib3.disable_warnings(InsecureRequestWarning)


ROOT = Path(__file__).resolve().parents[1]
WORKSPACE_ROOT = ROOT.parent
DEFAULT_INPUT = (
    WORKSPACE_ROOT / "Strona-trenerzy" / "data" / "poznan_biura_rachunkowe_2026.csv"
)

OUTPUT_PROFILE_TS = ROOT / "src" / "data" / "biura" / "biuroProfiles.generated.ts"
OUTPUT_RESEARCH_JSON = ROOT / "src" / "data" / "biura" / "biuroResearch.generated.json"
OUTPUT_SUMMARY_CSV = ROOT / "reports" / "biura_research_summary.csv"
OUTPUT_REVIEW_MD = ROOT / "reports" / "biura_manual_review.md"

EMAIL_RE = re.compile(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}")
PRICE_RE = re.compile(
    r"(?:od\s*)?\d{2,6}(?:[\s\u00A0]\d{3})*(?:[.,]\d{1,2})?\s?(?:z[lł]|PLN|pln)",
    re.IGNORECASE,
)

CITY_FORMS = {
    "Poznań": {"nominative": "Poznań", "genitive": "Poznania", "locative": "Poznaniu"},
    "Gdańsk": {"nominative": "Gdańsk", "genitive": "Gdańska", "locative": "Gdańsku"},
    "Bydgoszcz": {
        "nominative": "Bydgoszcz",
        "genitive": "Bydgoszczy",
        "locative": "Bydgoszczy",
    },
    "Toruń": {"nominative": "Toruń", "genitive": "Torunia", "locative": "Toruniu"},
    "Warszawa": {
        "nominative": "Warszawa",
        "genitive": "Warszawy",
        "locative": "Warszawie",
    },
    "Wrocław": {
        "nominative": "Wrocław",
        "genitive": "Wrocławia",
        "locative": "Wrocławiu",
    },
    "Kraków": {"nominative": "Kraków", "genitive": "Krakowa", "locative": "Krakowie"},
}

SERVICE_PATTERNS = {
    "Pełna księgowość": [
        "pełna księgowość",
        "księgi rachunkowe",
        "sprawozdania finansowe",
        "obsługa spółek",
    ],
    "KPiR i ryczałt": [
        "kpir",
        "ryczałt",
        "jednoosob",
        "jdg",
    ],
    "Kadry i płace": [
        "kadry i płace",
        "kadrowo-płac",
        "listy płac",
        "umowy o pracę",
    ],
    "ZUS i rozliczenia": [
        "zus",
        "ubezpieczenia społeczne",
        "deklaracje zus",
    ],
    "Doradztwo podatkowe": [
        "doradztwo podatkowe",
        "doradca podatkowy",
        "optymalizacja podatkowa",
        "interpretacje",
    ],
    "KSeF i e-dokumenty": [
        "ksef",
        "faktury ustrukturyzowane",
        "e-dokument",
        "obieg dokumentów",
    ],
    "Obsługa e-commerce": [
        "e-commerce",
        "sklep internetowy",
        "amazon",
        "allegro",
        "shopify",
    ],
}

SERVICE_DESCRIPTIONS = {
    "Pełna księgowość": "Prowadzenie ksiąg rachunkowych, sprawozdawczość i bieżące wsparcie dla spółek.",
    "KPiR i ryczałt": "Rozliczenia JDG i spółek cywilnych z naciskiem na przewidywalność podatków.",
    "Kadry i płace": "Obsługa dokumentacji pracowniczej, list płac oraz procesów kadrowych.",
    "ZUS i rozliczenia": "Terminowe rozliczenia ZUS i dokumenty wymagane do bieżącej działalności.",
    "Doradztwo podatkowe": "Wsparcie decyzyjne i podatkowe dopasowane do modelu biznesowego.",
    "KSeF i e-dokumenty": "Przygotowanie i obsługa procesów KSeF oraz cyfrowego obiegu dokumentów.",
    "Obsługa e-commerce": "Rozliczenia sprzedaży internetowej i wsparcie podatkowe dla handlu online.",
}

SOCIAL_HOSTS = {
    "facebook": "facebook.com",
    "instagram": "instagram.com",
    "linkedin": "linkedin.com",
    "youtube": "youtube.com",
}


@dataclass
class PageData:
    url: str
    title: str
    description: str
    text: str
    links: List[str]
    og_image: str
    logo_candidate: str
    team_candidate: str


def clean(value: str) -> str:
    return " ".join((value or "").replace("\u00a0", " ").strip().split())


def slugify(value: str) -> str:
    ascii_value = unicodedata.normalize("NFD", value)
    ascii_value = "".join(ch for ch in ascii_value if unicodedata.category(ch) != "Mn")
    ascii_value = ascii_value.lower()
    ascii_value = re.sub(r"[^a-z0-9]+", "-", ascii_value)
    return re.sub(r"-{2,}", "-", ascii_value).strip("-") or "biuro"


def normalize_url(url: str) -> str:
    url = clean(url)
    if not url:
        return ""
    if url.startswith(("http://", "https://")):
        return url
    return f"https://{url}"


def split_candidates(raw: str, separators: str = r"[|;,]") -> List[str]:
    return [clean(part) for part in re.split(separators, raw or "") if clean(part)]


def first_email(raw: str) -> str:
    emails = EMAIL_RE.findall(raw or "")
    return emails[0] if emails else ""


def infer_city(legal_name: str, address: str) -> str:
    search_base = f"{legal_name} {address}".lower()
    for city in CITY_FORMS:
        if city.lower() in search_base:
            return city
    return "Poznań"


def city_forms(city: str) -> Dict[str, str]:
    return CITY_FORMS.get(city, CITY_FORMS["Poznań"])


def detect_display_name(raw_name: str) -> str:
    name = clean(raw_name)
    if " - " in name:
        short = clean(name.split(" - ")[0])
        if len(short) >= 8:
            return short
    if "|" in name:
        short = clean(name.split("|")[0])
        if len(short) >= 8:
            return short
    if len(name) > 70:
        short = clean(name[:70].rsplit(" ", 1)[0])
        if short:
            return short
    return name


def sanitize_tagline(text: str) -> str:
    value = clean(text)
    if not value:
        return "Księgowość, kadry i podatki w jednym miejscu."

    value = EMAIL_RE.sub("", value)
    value = re.sub(r"\+?\d(?:[\d\s\-]{7,}\d)?", "", value)
    value = re.sub(r"\s{2,}", " ", value).strip(" -,:;")

    if len(value) > 180:
        value = value[:180]
        if " " in value:
            value = value.rsplit(" ", 1)[0]
        value = f"{value}."

    if len(value) < 40:
        return "Księgowość, kadry i podatki w jednym miejscu."
    return value


def team_type_from_name(legal_name: str) -> Tuple[str, str, str]:
    lowered = legal_name.lower()
    if any(
        token in lowered
        for token in ["sp. z o.o", "sp z o o", "spółka", "s.a.", "sp. k"]
    ):
        return "wieloosobowe", "high", "legal_name"
    return "nieokreslone", "low", "legal_name"


def service_model_from_text(
    text: str, fallback_has_address: bool
) -> Tuple[str, str, str]:
    lowered = text.lower()
    has_online = any(token in lowered for token in ["online", "zdaln", "remote"])
    has_office = any(token in lowered for token in ["stacjonarn", "biuro", "spotkanie"])

    if has_online and has_office:
        return "hybrydowo", "medium", "website_text"
    if has_online:
        return "online", "medium", "website_text"
    if has_office or fallback_has_address:
        return "stacjonarnie", "medium", "website_text"
    return "nieokreslone", "low", "website_text"


def request_page(
    session: requests.Session, url: str, timeout: int = 12
) -> Optional[PageData]:
    if not url:
        return None
    try:
        response = session.get(url, timeout=timeout, allow_redirects=True, verify=False)
        response.raise_for_status()
    except Exception:
        return None

    html = response.text
    soup = BeautifulSoup(html, "html.parser")

    title = clean(soup.title.get_text(" ", strip=True) if soup.title else "")
    description = ""
    description_tag = soup.find("meta", attrs={"name": "description"})
    if description_tag and description_tag.get("content"):
        description = clean(description_tag["content"])

    og_image = ""
    og_tag = soup.find("meta", attrs={"property": "og:image"}) or soup.find(
        "meta", attrs={"name": "og:image"}
    )
    if og_tag and og_tag.get("content"):
        og_image = urljoin(response.url, clean(og_tag["content"]))

    links: List[str] = []
    for anchor in soup.find_all("a"):
        href = clean(anchor.get("href", ""))
        if not href:
            continue
        full = urljoin(response.url, href)
        if full.startswith("http://") or full.startswith("https://"):
            links.append(full)

    logo_candidate = ""
    team_candidate = ""
    for img in soup.find_all("img"):
        src = clean(img.get("src", ""))
        if not src:
            continue
        full_src = urljoin(response.url, src)
        attrs_text = " ".join(
            [
                clean(img.get("alt", "")),
                clean(img.get("class", ""))
                if isinstance(img.get("class"), str)
                else " ".join(img.get("class", []) or []),
                clean(img.get("id", "")),
            ]
        ).lower()

        if not logo_candidate and any(
            token in attrs_text for token in ["logo", "brand"]
        ):
            logo_candidate = full_src
        if not team_candidate and any(
            token in attrs_text
            for token in ["zesp", "team", "o nas", "wlasc", "właśc", "ksieg", "księg"]
        ):
            team_candidate = full_src

    text = clean(soup.get_text(" ", strip=True))

    return PageData(
        url=response.url,
        title=title,
        description=description,
        text=text,
        links=list(dict.fromkeys(links)),
        og_image=og_image,
        logo_candidate=logo_candidate,
        team_candidate=team_candidate,
    )


def candidate_subpages(home: PageData) -> List[str]:
    if not home.url:
        return []
    domain = urlparse(home.url).netloc
    wanted_tokens = ["oferta", "uslugi", "usługi", "cennik", "o-nas", "kontakt", "ksef"]
    selected: List[str] = []
    for link in home.links:
        parsed = urlparse(link)
        if parsed.netloc != domain:
            continue
        lowered = link.lower()
        if any(token in lowered for token in wanted_tokens):
            selected.append(link)
    deduped = list(dict.fromkeys(selected))
    return deduped[:4]


def detect_services(text: str) -> List[Tuple[str, str]]:
    lowered = text.lower()
    found: List[Tuple[str, str]] = []
    for service_name, patterns in SERVICE_PATTERNS.items():
        if any(pattern in lowered for pattern in patterns):
            confidence = (
                "high"
                if sum(1 for pattern in patterns if pattern in lowered) >= 2
                else "medium"
            )
            found.append((service_name, confidence))
    if not found:
        found = [
            ("Pełna księgowość", "low"),
            ("KPiR i ryczałt", "low"),
            ("Kadry i płace", "low"),
        ]
    return found[:6]


def extract_socials(links: Iterable[str], social_raw: str) -> Dict[str, str]:
    candidates = list(links) + split_candidates(social_raw)
    result = {"facebook": "", "instagram": "", "linkedin": "", "youtube": ""}
    for candidate in candidates:
        lowered = candidate.lower()
        for key, host in SOCIAL_HOSTS.items():
            if not result[key] and host in lowered:
                result[key] = candidate
    return result


def detect_team_type(text: str, name_team_type: str) -> Tuple[str, str, str]:
    lowered = text.lower()
    if any(
        token in lowered
        for token in [
            "nasz zespol",
            "nasz zespół",
            "specjalist",
            "doradc",
            "ksiegowych",
            "księgowych",
        ]
    ):
        return "wieloosobowe", "medium", "website_text"
    if any(
        token in lowered
        for token in [
            "nazywam sie",
            "nazywam się",
            "właścicielka",
            "właściciel",
            "moje biuro",
        ]
    ):
        return "jednoosobowe", "medium", "website_text"
    if name_team_type != "nieokreslone":
        return name_team_type, "high", "legal_name"
    return "nieokreslone", "low", "not_detected"


def extract_prices(text: str) -> List[str]:
    prices = [
        clean(
            match.group(0).replace("zl", "zł").replace("PLN", "zł").replace("pln", "zł")
        )
        for match in PRICE_RE.finditer(text)
    ]

    def numeric_value(price: str) -> Optional[float]:
        digits = re.sub(r"[^0-9,.]", "", price)
        digits = digits.replace(",", ".")
        try:
            return float(digits)
        except ValueError:
            return None

    unique_prices: List[str] = []
    seen = set()
    for price in prices:
        value = numeric_value(price)
        if value is None:
            continue
        if value < 50 or value > 8000:
            continue

        normalized = price.lower()
        if normalized in seen:
            continue
        seen.add(normalized)
        unique_prices.append(price)
    return unique_prices[:8]


def parse_email_candidates(raw_email: str, website_text: str) -> List[str]:
    emails = []
    for candidate in split_candidates(raw_email):
        emails.extend(EMAIL_RE.findall(candidate))
    emails.extend(EMAIL_RE.findall(website_text))

    deduped: List[str] = []
    seen = set()
    for email in emails:
        lowered = email.lower()
        if lowered in seen:
            continue
        seen.add(lowered)
        deduped.append(lowered)
    return deduped


def confidence_bucket(score: int) -> str:
    if score >= 7:
        return "high"
    if score >= 4:
        return "medium"
    return "low"


def build_pricing_plans(
    prices: List[str], service_names: List[str]
) -> List[Dict[str, object]]:
    if prices:
        start = prices[0]
        biznes = prices[1] if len(prices) > 1 else f"od {start.replace('od ', '')}"
        premium = prices[2] if len(prices) > 2 else "wycena indywidualna"
    else:
        start = "od 350 zł / mies."
        biznes = "od 990 zł / mies."
        premium = "wycena indywidualna"

    return [
        {
            "name": "Start",
            "subtitle": "Dla JDG i mniejszych firm usługowych",
            "price": start,
            "features": [
                service_names[0] if service_names else "Bieżąca księgowość",
                "Kontakt mailowy i telefoniczny",
                "Przypomnienia terminów podatkowych",
            ],
        },
        {
            "name": "Biznes",
            "subtitle": "Dla firm rosnących i zespołów operacyjnych",
            "price": biznes,
            "features": [
                service_names[1]
                if len(service_names) > 1
                else "Obsługa VAT i dokumentów",
                "Wsparcie kadrowo-płacowe",
                "Dedykowany opiekun współpracy",
            ],
        },
        {
            "name": "Premium",
            "subtitle": "Dla spółek i złożonych procesów finansowych",
            "price": premium,
            "features": [
                service_names[2]
                if len(service_names) > 2
                else "Zaawansowane wsparcie doradcze",
                "Raportowanie zarządcze",
                "Priorytetowe konsultacje",
            ],
        },
    ]


def generate_profile(
    row: Dict[str, str], session: requests.Session
) -> Dict[str, object]:
    legal_name = clean(row.get("imie", ""))
    display_name = detect_display_name(legal_name)
    slug = slugify(display_name)

    website = normalize_url(row.get("strona", ""))
    map_url = clean(row.get("url", ""))
    address = clean(row.get("ulica", ""))
    city = infer_city(legal_name, address)
    forms = city_forms(city)

    name_team_type, _, _ = team_type_from_name(legal_name)

    home = request_page(session, website) if website else None
    pages: List[PageData] = [home] if home else []

    if home:
        for subpage in candidate_subpages(home):
            page = request_page(session, subpage, timeout=10)
            if page:
                pages.append(page)

    merged_text = " ".join(page.text for page in pages if page.text)
    merged_links = []
    for page in pages:
        merged_links.extend(page.links)
    merged_links = list(dict.fromkeys(merged_links))

    detected_services = detect_services(merged_text)
    service_names = [item[0] for item in detected_services]
    prices = extract_prices(merged_text)

    team_type, team_confidence, team_source = detect_team_type(
        merged_text, name_team_type
    )
    service_model, model_confidence, model_source = service_model_from_text(
        merged_text, bool(address)
    )

    emails = parse_email_candidates(row.get("email", ""), merged_text)
    primary_email = emails[0] if emails else first_email(row.get("email", ""))

    socials = extract_socials(merged_links, row.get("social_media", ""))

    title_source = home.title if home else legal_name
    tagline = (
        sanitize_tagline(home.description)
        if home and home.description
        else "Księgowość, kadry i podatki w jednym miejscu."
    )

    logo_candidate = ""
    team_candidate = ""
    hero_candidate = ""
    page_sources = []
    for page in pages:
        page_sources.append(page.url)
        if not hero_candidate and page.og_image:
            hero_candidate = page.og_image
        if not logo_candidate and page.logo_candidate:
            logo_candidate = page.logo_candidate
        if not team_candidate and page.team_candidate:
            team_candidate = page.team_candidate

    if not hero_candidate:
        hero_candidate = "/images/hero-accountant.jpg"

    service_score = len(
        [confidence for _, confidence in detected_services if confidence != "low"]
    )
    pricing_score = 2 if prices else 0
    media_score = (
        2 if hero_candidate and hero_candidate != "/images/hero-accountant.jpg" else 0
    )
    base_score = (
        service_score
        + pricing_score
        + media_score
        + (1 if primary_email else 0)
        + (1 if website else 0)
    )

    summary_confidence = confidence_bucket(base_score)

    services = [
        {
            "title": service_name,
            "description": SERVICE_DESCRIPTIONS.get(
                service_name, "Obsługa księgowa dopasowana do potrzeb firmy."
            ),
            "priceHint": prices[idx] if idx < len(prices) else "wycena indywidualna",
            "confidence": confidence,
        }
        for idx, (service_name, confidence) in enumerate(detected_services)
    ]

    default_owner_name = "Zespół biura"
    if team_type == "jednoosobowe":
        default_owner_name = display_name

    profile = {
        "slug": slug,
        "legalName": legal_name,
        "displayName": display_name,
        "navName": display_name,
        "tagline": tagline,
        "city": city,
        "cityForms": forms,
        "address": address,
        "phone": clean(row.get("numer", "")),
        "email": primary_email,
        "emails": emails,
        "website": website,
        "mapUrl": f"https://www.google.com/maps?q={quote_plus(address or city)}&output=embed",
        "socials": socials,
        "teamType": team_type,
        "serviceModel": service_model,
        "hero": {
            "badge": f"Biuro rachunkowe z {forms['genitive']}",
            "titleTop": display_name,
            "titleAccent": "Księgowość i podatki dla firm",
            "text": tagline,
            "image": hero_candidate,
            "imageFallback": "/images/hero-accountant-fallback.jpg",
            "stats": [
                {
                    "label": "Model pracy",
                    "value": service_model,
                },
                {
                    "label": "Typ zespołu",
                    "value": team_type,
                },
            ],
        },
        "services": services,
        "pricingPlans": build_pricing_plans(prices, service_names),
        "workflow": [
            "Krótka konsultacja i analiza potrzeb firmy",
            "Ustalenie procesu dokumentów i harmonogramu",
            "Bieżąca obsługa oraz stały kontakt operacyjny",
        ],
        "valueProps": [
            "Jasna komunikacja terminów i zobowiązań",
            "Zakres usług dopasowany do etapu firmy",
            "Wsparcie księgowe i podatkowe w codziennych decyzjach",
        ],
        "caseStudies": [
            {
                "company": "Firma usługowa B2B",
                "challenge": "Brak przewidywalności rozliczeń i terminów.",
                "result": "Stały harmonogram i uporządkowany proces dokumentów.",
            },
            {
                "company": "Zespół sprzedażowy",
                "challenge": "Rosnąca liczba dokumentów i rozliczeń.",
                "result": "Ustandaryzowany proces księgowy i szybszy obieg informacji.",
            },
            {
                "company": "Spółka operacyjna",
                "challenge": "Potrzeba lepszej kontroli kosztów i raportowania.",
                "result": "Regularne podsumowania i lepsza widoczność finansów.",
            },
        ],
        "faq": [
            {
                "question": "Jak szybko mogę rozpocząć współpracę?",
                "answer": "Najczęściej start jest możliwy po krótkiej konsultacji i ustaleniu listy dokumentów.",
            },
            {
                "question": "Czy obsługa może być prowadzona online?",
                "answer": "Tak, zakres współpracy ustalamy indywidualnie w zależności od potrzeb firmy.",
            },
            {
                "question": "Czy pomagacie przy zmianie biura rachunkowego?",
                "answer": "Tak, wspieramy proces przekazania dokumentacji i przejęcia obsługi.",
            },
        ],
        "team": [
            {
                "name": default_owner_name,
                "role": "Opiekun współpracy",
                "experience": "Doświadczenie w obsłudze firm",
                "credentials": "Księgowość i podatki",
                "image": team_candidate or "/images/team-marta.jpg",
                "objectPosition": "center 16%",
            }
        ],
        "media": {
            "logoUrl": logo_candidate,
            "heroCandidateUrl": hero_candidate,
            "teamCandidateUrl": team_candidate,
        },
        "research": {
            "updatedAt": datetime.now(timezone.utc).isoformat(),
            "sources": list(dict.fromkeys(page_sources + [website] + [map_url])),
            "summaryConfidence": summary_confidence,
            "fields": {
                "displayName": {
                    "value": title_source or display_name,
                    "confidence": "high" if title_source else "medium",
                    "source": home.url if home else "csv",
                },
                "services": {
                    "value": ", ".join(service_names),
                    "confidence": confidence_bucket(service_score + 1),
                    "source": home.url if home else "csv",
                },
                "pricing": {
                    "value": ", ".join(prices) if prices else "brak jawnego cennika",
                    "confidence": "high" if prices else "low",
                    "source": home.url if home else "csv",
                },
                "teamType": {
                    "value": team_type,
                    "confidence": team_confidence,
                    "source": team_source,
                },
                "workModel": {
                    "value": service_model,
                    "confidence": model_confidence,
                    "source": model_source,
                },
                "media": {
                    "value": hero_candidate,
                    "confidence": "high"
                    if hero_candidate != "/images/hero-accountant.jpg"
                    else "low",
                    "source": home.url if home else "csv",
                },
            },
            "notes": [
                "Profil wygenerowany automatycznie. Przed publikacją wykonaj ręczne QA treści i mediów.",
            ],
        },
    }
    return profile


def build_reports(profiles: List[Dict[str, object]]) -> None:
    OUTPUT_RESEARCH_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_SUMMARY_CSV.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_REVIEW_MD.parent.mkdir(parents=True, exist_ok=True)

    with OUTPUT_RESEARCH_JSON.open("w", encoding="utf-8") as fp:
        json.dump(profiles, fp, ensure_ascii=False, indent=2)

    summary_fields = [
        "slug",
        "displayName",
        "email",
        "phone",
        "website",
        "teamType",
        "serviceModel",
        "servicesCount",
        "pricingHintsCount",
        "heroCandidateUrl",
        "summaryConfidence",
    ]

    with OUTPUT_SUMMARY_CSV.open("w", encoding="utf-8", newline="") as fp:
        writer = csv.DictWriter(fp, fieldnames=summary_fields)
        writer.writeheader()
        for profile in profiles:
            writer.writerow(
                {
                    "slug": profile["slug"],
                    "displayName": profile["displayName"],
                    "email": profile["email"],
                    "phone": profile["phone"],
                    "website": profile["website"],
                    "teamType": profile["teamType"],
                    "serviceModel": profile["serviceModel"],
                    "servicesCount": len(profile["services"]),
                    "pricingHintsCount": len(
                        [p for p in profile["pricingPlans"] if p["price"]]
                    ),
                    "heroCandidateUrl": profile["media"]["heroCandidateUrl"],
                    "summaryConfidence": profile["research"]["summaryConfidence"],
                }
            )

    missing_media = [
        profile
        for profile in profiles
        if profile["media"]["heroCandidateUrl"] == "/images/hero-accountant.jpg"
    ]
    missing_prices = [
        profile
        for profile in profiles
        if all(
            "wycena indywidualna" in plan["price"].lower()
            or "od 350" in plan["price"].lower()
            for plan in profile["pricingPlans"]
        )
    ]
    low_confidence = [
        profile
        for profile in profiles
        if profile["research"]["summaryConfidence"] == "low"
    ]

    confidence_counter = Counter(
        profile["research"]["summaryConfidence"] for profile in profiles
    )
    with OUTPUT_REVIEW_MD.open("w", encoding="utf-8") as fp:
        fp.write("# Manual Review Checklist - Biura rachunkowe\n\n")
        fp.write(f"- Total profiles: **{len(profiles)}**\n")
        fp.write(f"- High confidence: **{confidence_counter.get('high', 0)}**\n")
        fp.write(f"- Medium confidence: **{confidence_counter.get('medium', 0)}**\n")
        fp.write(f"- Low confidence: **{confidence_counter.get('low', 0)}**\n\n")

        fp.write("## Profiles requiring manual media check\n")
        for profile in missing_media[:80]:
            fp.write(f"- `{profile['slug']}` - {profile['displayName']}\n")
        fp.write("\n## Profiles requiring manual pricing check\n")
        for profile in missing_prices[:80]:
            fp.write(f"- `{profile['slug']}` - {profile['displayName']}\n")
        fp.write("\n## Low-confidence profiles\n")
        for profile in low_confidence[:80]:
            fp.write(f"- `{profile['slug']}` - {profile['displayName']}\n")


def write_generated_profiles_ts(profiles: List[Dict[str, object]]) -> None:
    OUTPUT_PROFILE_TS.parent.mkdir(parents=True, exist_ok=True)
    profile_map = {profile["slug"]: profile for profile in profiles}
    default_slug = profiles[0]["slug"] if profiles else ""
    payload = json.dumps(profile_map, ensure_ascii=False, indent=2)

    content = (
        "/* eslint-disable */\n"
        "import type { BiuroProfile } from './biuroProfile';\n\n"
        f"export const defaultBiuroSlug = '{default_slug}';\n\n"
        f"export const biuroProfilesGenerated = {payload} as Record<string, BiuroProfile>;\n"
    )

    with OUTPUT_PROFILE_TS.open("w", encoding="utf-8") as fp:
        fp.write(content)


def run(input_csv: Path) -> None:
    if not input_csv.exists():
        raise FileNotFoundError(f"Input file not found: {input_csv}")

    with input_csv.open("r", encoding="utf-8") as fp:
        rows = list(csv.DictReader(fp))

    session = requests.Session()
    session.headers.update(
        {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            "Accept-Language": "pl-PL,pl;q=0.9,en;q=0.8",
        }
    )

    profiles: List[Dict[str, object]] = []
    used_slugs: Dict[str, int] = {}
    for idx, row in enumerate(rows, start=1):
        legal_name = clean(row.get("imie", ""))
        if not legal_name:
            continue
        profile = generate_profile(row, session)

        base_slug = str(profile["slug"])
        occurrence = used_slugs.get(base_slug, 0) + 1
        used_slugs[base_slug] = occurrence
        if occurrence > 1:
            profile["slug"] = f"{base_slug}-{occurrence}"

        profiles.append(profile)
        print(f"[{idx}/{len(rows)}] {profile['slug']}")

    profiles.sort(key=lambda item: item["displayName"])

    write_generated_profiles_ts(profiles)
    build_reports(profiles)

    print(f"Generated profiles: {len(profiles)}")
    print(f"- {OUTPUT_PROFILE_TS}")
    print(f"- {OUTPUT_RESEARCH_JSON}")
    print(f"- {OUTPUT_SUMMARY_CSV}")
    print(f"- {OUTPUT_REVIEW_MD}")


if __name__ == "__main__":
    run(DEFAULT_INPUT)
