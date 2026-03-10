from __future__ import annotations

import copy
import csv
import hashlib
import json
import re
import unicodedata
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_CSV = ROOT / "data" / "poznan_trenerzy_personalny_2026.csv"
QUICKWINS_MD = (
    ROOT.parent / "Poznan" / "quickwins_poznan_email_detailed_research_2026-02-24.md"
)
OUT_PROFILES_TS = ROOT / "data" / "poznanTrainerProfiles.ts"
OUT_QW_TS = ROOT / "data" / "poznanTrainerQuickWinOverrides.ts"
OUT_LINKS_MD = ROOT.parent / "Poznan" / "localhost_links_poznan_email_trainers.md"

LAN_HOST = "192.168.0.175"


PALETTES = [
    {
        "accent": "#94c918",
        "accentDark": "#73a10f",
        "accentSoft": "#d6ef8a",
        "bg": "#090b05",
        "bgSoft": "#12170a",
        "surface": "#171f0e",
        "surfaceAlt": "#222d14",
        "border": "#33411c",
        "textMuted": "#b6c5a1",
    },
    {
        "accent": "#f97316",
        "accentDark": "#c2410c",
        "accentSoft": "#fdba74",
        "bg": "#100905",
        "bgSoft": "#1a1009",
        "surface": "#25160d",
        "surfaceAlt": "#321d10",
        "border": "#4a2a14",
        "textMuted": "#d4b89f",
    },
    {
        "accent": "#06b6d4",
        "accentDark": "#0e7490",
        "accentSoft": "#67e8f9",
        "bg": "#060b0d",
        "bgSoft": "#0d1519",
        "surface": "#112027",
        "surfaceAlt": "#16303b",
        "border": "#24414f",
        "textMuted": "#a8c8cf",
    },
    {
        "accent": "#eab308",
        "accentDark": "#a16207",
        "accentSoft": "#fde68a",
        "bg": "#0f0d05",
        "bgSoft": "#191409",
        "surface": "#241c0d",
        "surfaceAlt": "#35280f",
        "border": "#4f3b14",
        "textMuted": "#d5c39a",
    },
    {
        "accent": "#ef4444",
        "accentDark": "#b91c1c",
        "accentSoft": "#fca5a5",
        "bg": "#120707",
        "bgSoft": "#1d0d0d",
        "surface": "#291313",
        "surfaceAlt": "#391818",
        "border": "#512222",
        "textMuted": "#d0acac",
    },
    {
        "accent": "#22c55e",
        "accentDark": "#15803d",
        "accentSoft": "#86efac",
        "bg": "#061008",
        "bgSoft": "#0d1a11",
        "surface": "#142617",
        "surfaceAlt": "#1c381f",
        "border": "#2a4e2c",
        "textMuted": "#a8c9af",
    },
]


NICHE_PRESETS = {
    "trening medyczny / fizjo": {
        "hero_top": "TRENING MEDYCZNY",
        "hero_accent": "BEZ BOLU I CHAOSU.",
        "hero_text": "Wspolpraca oparta na analizie ruchu, bezpiecznej progresji i planie dopasowanym do codziennego rytmu.",
        "about_text": "Praca z osobami po kontuzjach i przeciazeniach, z celem bezpiecznego powrotu do formy.",
        "value_props": [
            {
                "title": "Start od konsultacji",
                "desc": "Najpierw analiza ruchu i jasny plan pierwszych 4 tygodni.",
            },
            {
                "title": "Sciezka bol -> forma",
                "desc": "Plan prowadzi od bezpiecznych wzorcow do regularnego treningu.",
            },
            {
                "title": "Cotygodniowa korekta",
                "desc": "Dopasowujemy obciazenie i technike na bazie realnych reakcji ciala.",
            },
            {
                "title": "Mierzalny progres",
                "desc": "Mniej bolu, lepszy zakres ruchu i stabilna poprawa sprawnosci.",
            },
        ],
        "plans": [
            {
                "name": "Start Bez Bolu",
                "subtitle": "Pierwsze 4 tygodnie pod kontrola.",
                "price": "299 zl",
                "period": "/ mies",
                "features": [
                    "Konsultacja i analiza ruchu",
                    "Plan medyczny pod objawy",
                    "Korekta techniki 1x tygodniowo",
                ],
                "ctaLabel": "Wybieram Start Bez Bolu",
            },
            {
                "name": "Ruch + Sila",
                "subtitle": "Kompleksowe prowadzenie 1:1.",
                "price": "599 zl",
                "period": "/ mies",
                "featured": True,
                "features": [
                    "Wszystko z pakietu Start",
                    "Plan silowy i mobilnosc",
                    "Cotygodniowy raport i korekty",
                    "Kontakt biezacy",
                ],
                "ctaLabel": "Wybieram Ruch + Sila",
            },
            {
                "name": "Performance Care",
                "subtitle": "Dla ambitnych celow i regularnego monitoringu.",
                "price": "999 zl",
                "period": "/ mies",
                "features": [
                    "Prowadzenie 1:1 premium",
                    "Priorytetowe konsultacje",
                    "Plan na 90 dni",
                ],
                "ctaLabel": "Wybieram Performance Care",
            },
        ],
        "faq": [
            {
                "q": "Czy moge trenowac przy bolu plecow lub kolan?",
                "a": "Tak, plan startuje od bezpiecznych zakresow i stopniowej progresji.",
            },
            {
                "q": "Jak szybko poczuje ulge?",
                "a": "Pierwsze zmiany najczesciej pojawiaja sie po 2-4 tygodniach regularnej pracy.",
            },
            {
                "q": "Czy potrzebuje silowni?",
                "a": "Nie zawsze. Start mozliwy jest rowniez w domu z podstawowym sprzetem.",
            },
            {
                "q": "Czy jest kontakt miedzy treningami?",
                "a": "Tak, szybkie korekty miedzy sesjami pomagaja utrzymac bezpieczny progres.",
            },
        ],
        "lead_magnet_title": "Pobierz checkliste: 7 krokow treningu bez bolu",
        "lead_magnet_text": "Krotki przewodnik jak trenowac bezpiecznie i wracac do formy bez improwizacji.",
    },
    "metamorfoza sylwetki": {
        "hero_top": "METAMORFOZA",
        "hero_accent": "KROK PO KROKU.",
        "hero_text": "Program pod redukcje lub budowe sylwetki z jasnym procesem, kontrola postepu i wsparciem 1:1.",
        "about_text": "Wspolpraca skupiona na realnych efektach, prostym planie i utrzymaniu regularnosci na co dzien.",
        "value_props": [
            {
                "title": "Plan pierwszych 30 dni",
                "desc": "Jasny start: diagnoza, plan i pierwsze nawyki bez przeciazania.",
            },
            {
                "title": "Dowody efektow",
                "desc": "Case studies z wynikiem, czasem wspolpracy i kontekstem klienta.",
            },
            {
                "title": "Jedno glowne CTA",
                "desc": "Krotka droga od wejscia na strone do umowienia konsultacji.",
            },
            {
                "title": "Cotygodniowe korekty",
                "desc": "Regularna analiza i dopasowanie planu pod realny progres.",
            },
        ],
        "plans": [
            {
                "name": "Start Sylwetka",
                "subtitle": "Plan i wdrozenie na 4 tygodnie.",
                "price": "299 zl",
                "period": "/ mies",
                "features": [
                    "Plan treningowy pod cel",
                    "Podstawy odzywiania i nawykow",
                    "Kontrola postepu raz w tygodniu",
                ],
                "ctaLabel": "Wybieram Start Sylwetka",
            },
            {
                "name": "Transformacja 1:1",
                "subtitle": "Pelne prowadzenie pod efekt.",
                "price": "599 zl",
                "period": "/ mies",
                "featured": True,
                "features": [
                    "Wszystko z pakietu Start",
                    "Plan zywieniowy i monitoring",
                    "Cotygodniowy raport",
                    "Kontakt biezacy",
                ],
                "ctaLabel": "Wybieram Transformacje 1:1",
            },
            {
                "name": "VIP Metamorfoza",
                "subtitle": "Dla osob z ambitnym celem.",
                "price": "999 zl",
                "period": "/ mies",
                "features": [
                    "Priorytetowe konsultacje",
                    "Strategia 90 dni",
                    "Pelna personalizacja",
                ],
                "ctaLabel": "Wybieram VIP Metamorfoza",
            },
        ],
        "faq": [
            {
                "q": "Czy dam rade, jesli zaczynam od zera?",
                "a": "Tak, plan jest skalowany do poziomu startowego i mozliwosci tygodnia.",
            },
            {
                "q": "Kiedy widac pierwsze efekty?",
                "a": "Najczesciej po 3-4 tygodniach widac pierwsze roznice w obwodach i samopoczuciu.",
            },
            {
                "q": "Czy dieta jest restrykcyjna?",
                "a": "Nie. Priorytetem sa nawyki i plan, ktory da sie utrzymac dlugoterminowo.",
            },
            {
                "q": "Jak wyglada kontakt?",
                "a": "Kontakt biezacy i cotygodniowy raport pomagaja utrzymac tempo progresu.",
            },
        ],
        "lead_magnet_title": "Pobierz plan: pierwsze 30 dni metamorfozy",
        "lead_magnet_text": "Gotowy start pod redukcje lub budowe sylwetki z checklistami i prostymi zasadami.",
    },
    "trening + odzywianie": {
        "hero_top": "TRENING + ODZYWIANIE",
        "hero_accent": "SPOJNY PLAN DZIALANIA.",
        "hero_text": "Laczymy trening, odzywianie i monitoring postepu, zeby wynik byl stabilny i realny do utrzymania.",
        "about_text": "Model wspolpracy dla osob, ktore chca poprawic sylwetke i zdrowie metaboliczne bez losowych metod.",
        "value_props": [
            {
                "title": "Plan 2w1",
                "desc": "Trening i odzywianie ustawione pod jeden cel i jeden harmonogram.",
            },
            {
                "title": "Regularny monitoring",
                "desc": "Cotygodniowe check-iny i szybkie korekty planu.",
            },
            {
                "title": "Dieta do utrzymania",
                "desc": "Praktyczne zalecenia i nawyki bez skrajnosci.",
            },
            {
                "title": "Jasna sciezka startu",
                "desc": "Od pierwszej konsultacji wiadomo, co robic i jak mierzyc efekt.",
            },
        ],
        "plans": [
            {
                "name": "Start Fit",
                "subtitle": "Pierwsze 4 tygodnie planu.",
                "price": "299 zl",
                "period": "/ mies",
                "features": [
                    "Plan treningowy",
                    "Zalecenia zywieniowe",
                    "Kontrola postepu 1x tydzien",
                ],
                "ctaLabel": "Wybieram Start Fit",
            },
            {
                "name": "Prowadzenie Kompleksowe",
                "subtitle": "Najczesciej wybierany pakiet.",
                "price": "599 zl",
                "period": "/ mies",
                "featured": True,
                "features": [
                    "Wszystko z pakietu Start",
                    "Szczegolowy monitoring",
                    "Raport i korekty co tydzien",
                    "Kontakt biezacy",
                ],
                "ctaLabel": "Wybieram Prowadzenie Kompleksowe",
            },
            {
                "name": "VIP Nutrition + Training",
                "subtitle": "Premium opieka i strategia 90 dni.",
                "price": "999 zl",
                "period": "/ mies",
                "features": [
                    "Prowadzenie premium 1:1",
                    "Priorytetowy kontakt",
                    "Strategia 90 dni i plan utrzymania",
                ],
                "ctaLabel": "Wybieram VIP",
            },
        ],
        "faq": [
            {
                "q": "Czy musze liczyc kazda kalorie?",
                "a": "Nie. Na start stawiamy na najwazniejsze nawyki i prosty system monitoringu.",
            },
            {
                "q": "Jak laczycie trening i odzywianie?",
                "a": "Plan treningowy i zywieniowy sa ustawione pod ten sam cel i ten sam horyzont czasu.",
            },
            {
                "q": "Czy moge zaczac przy nieregularnym trybie pracy?",
                "a": "Tak, plan jest dopasowywany do realnego tygodnia i mozliwosci.",
            },
            {
                "q": "Jak mierzymy efekt?",
                "a": "Co tydzien analizujemy postep i aktualizujemy plan dzialania.",
            },
        ],
        "lead_magnet_title": "Pobierz plan startowy: trening + odzywianie",
        "lead_magnet_text": "Praktyczny przewodnik, jak polaczyc trening i nawyki zywieniowe bez chaosu.",
    },
    "trening personalny 1:1": {
        "hero_top": "TRENING 1:1",
        "hero_accent": "POD TWOJ CEL.",
        "hero_text": "Indywidualna wspolpraca oparta na jasnym planie, regularnych korektach i prostej sciezce startu.",
        "about_text": "Oferta skupia sie na klarownym procesie: konsultacja, plan, wdrozenie i cotygodniowe korekty.",
        "value_props": [
            {
                "title": "Start od konsultacji",
                "desc": "Ustalamy cel, poziom startowy i realny harmonogram.",
            },
            {
                "title": "Jasna oferta",
                "desc": "Klient od razu widzi roznice miedzy pakietami i wybiera poziom wsparcia.",
            },
            {
                "title": "Cotygodniowy monitoring",
                "desc": "Raport i korekty utrzymuja tempo progresu.",
            },
            {
                "title": "Kontakt biezacy",
                "desc": "Szybkie odpowiedzi i konkretne wskazowki do wdrozenia.",
            },
        ],
        "plans": [
            {
                "name": "Start 1:1",
                "subtitle": "Plan i wdrozenie podstaw.",
                "price": "299 zl",
                "period": "/ mies",
                "features": [
                    "Plan treningowy dopasowany do celu",
                    "Korekta techniki",
                    "Kontakt raz w tygodniu",
                ],
                "ctaLabel": "Wybieram Start 1:1",
            },
            {
                "name": "Prowadzenie 1:1",
                "subtitle": "Najczesciej wybierany pakiet.",
                "price": "599 zl",
                "period": "/ mies",
                "featured": True,
                "features": [
                    "Wszystko z pakietu Start",
                    "Cotygodniowy raport i korekty",
                    "Wsparcie zywieniowe",
                    "Kontakt biezacy",
                ],
                "ctaLabel": "Wybieram Prowadzenie 1:1",
            },
            {
                "name": "VIP Hybrid",
                "subtitle": "Opieka premium i strategia 90 dni.",
                "price": "999 zl",
                "period": "/ mies",
                "features": [
                    "Priorytetowe wsparcie",
                    "Strategia 90 dni",
                    "Pelna personalizacja",
                ],
                "ctaLabel": "Wybieram VIP Hybrid",
            },
        ],
        "faq": [
            {
                "q": "Czy moge zaczac od zera?",
                "a": "Tak, plan jest skalowany do poziomu i aktualnej sprawnosci.",
            },
            {
                "q": "Jak szybko odpisujesz po zgloszeniu?",
                "a": "Najczesciej w ciagu 24 godzin z propozycja pierwszego kroku.",
            },
            {
                "q": "Czy wspolpraca jest tylko stacjonarna?",
                "a": "Mozliwy jest model stacjonarny, online lub hybrydowy.",
            },
            {
                "q": "Jak wyglada pierwszy miesiac?",
                "a": "Start od konsultacji, wdrozenie planu i cotygodniowe korekty.",
            },
        ],
        "lead_magnet_title": "Pobierz plan startowy: pierwsze 7 dni wspolpracy",
        "lead_magnet_text": "Krotki przewodnik jak ruszyc z treningiem 1:1 i utrzymac regularnosc.",
    },
}


@dataclass
class QuickWinRow:
    name: str
    email: str
    source: str
    finding: str
    quick_win: str
    confidence: str


def normalize(value: str) -> str:
    return re.sub(r"\s+", " ", (value or "").replace("\xa0", " ")).strip()


def normalize_key(value: str) -> str:
    value = normalize(value)
    value = unicodedata.normalize("NFKD", value)
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def slugify_like_app(value: str) -> str:
    value = normalize(value)
    value = unicodedata.normalize("NFD", value)
    value = "".join(ch for ch in value if unicodedata.category(ch) != "Mn")
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = re.sub(r"-{2,}", "-", value)
    return value.strip("-")


def to_url(value: str) -> str:
    value = normalize(value)
    if not value:
        return ""
    if re.match(r"^https?://", value, flags=re.I):
        return value
    return f"https://{value}"


def first_email(value: str) -> str:
    value = normalize(value)
    if not value:
        return ""
    parts = re.split(r"[;,]", value)
    for part in parts:
        email = normalize(part)
        if email:
            return email
    return ""


def pick_palette(slug: str) -> dict:
    idx = int(hashlib.md5(slug.encode("utf-8")).hexdigest(), 16) % len(PALETTES)
    return PALETTES[idx]


def nav_name(name: str) -> str:
    short = re.split(r"\||-", name)[0].strip()
    if len(short) >= 4:
        return short
    return name


def clean_confidence(value: str) -> str:
    value = normalize_key(value)
    if value in {"high", "medium", "low"}:
        return value
    return "medium"


def parse_quickwins() -> tuple[dict[str, QuickWinRow], dict[str, QuickWinRow]]:
    by_email: dict[str, QuickWinRow] = {}
    by_name: dict[str, QuickWinRow] = {}

    for raw_line in QUICKWINS_MD.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or " | " not in line:
            continue
        if (
            line.startswith("#")
            or line.startswith("Data:")
            or line.startswith("Zakres:")
        ):
            continue
        if line.startswith("Format:"):
            continue

        email_match = re.search(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", line)
        if not email_match:
            continue
        email = email_match.group(0)

        marker = f" | {email} | "
        if marker not in line:
            continue

        name, right = line.split(marker, 1)
        if " | " not in right:
            continue

        source, rest = right.split(" | ", 1)
        if " | " not in rest:
            continue

        try:
            finding, quick_win, confidence_raw = rest.rsplit(" | ", 2)
        except ValueError:
            continue
        confidence = clean_confidence(confidence_raw)

        row = QuickWinRow(
            name=name,
            email=normalize(email).lower(),
            source=normalize(source),
            finding=normalize(finding),
            quick_win=normalize(quick_win),
            confidence=confidence,
        )

        if row.email:
            by_email[row.email] = row
        by_name[normalize_key(name)] = row

    return by_email, by_name


def infer_niche(title: str, category: str, quick_win: str, finding: str) -> str:
    blob = normalize_key(" ".join([title, category, quick_win, finding]))

    if any(
        key in blob
        for key in [
            "medycz",
            "fizjo",
            "fizjoter",
            "terapia",
            "bol",
            "kontuz",
            "rehabilit",
            "uroginek",
        ]
    ):
        return "trening medyczny / fizjo"

    if any(key in blob for key in ["diet", "odzyw", "psychodiet", "pcos", "insulino"]):
        return "trening + odzywianie"

    if any(key in blob for key in ["metamorfoz", "redukc", "sylwet", "masa"]):
        return "metamorfoza sylwetki"

    return "trening personalny 1:1"


def build_quickwin_override(
    quick_win: str,
    finding: str,
    source: str,
    confidence: str,
    niche: str,
) -> dict:
    text = normalize_key(f"{quick_win} {finding}")
    source_low = (source or "").lower()
    out: dict = {}

    def has(*keywords: str) -> bool:
        return any(keyword in text for keyword in keywords)

    if has(
        "jedno glowne cta",
        "jednoznaczne cta",
        "one-page",
        "one page",
        "wizytowke",
        "wizytowka",
    ):
        out["heroMode"] = "single-cta"
        out["singleContactCta"] = True

    if has("konsult", "rezerwac", "booksy", "kalendarz", "formularz", "umow"):
        out["showConsultationCalendar"] = True
        out.setdefault("stickyMode", "consult-15")

    if has("kwalifikacyjn"):
        out["contactMode"] = "qualification-3q"
        out["singleContactCta"] = True

    if has("pakiet", "cennik", "cena", "kalkulator"):
        out.setdefault("heroMode", "promise-packages")
        out["showPricingCaseStudies"] = True

    if has("blog", "artyk", "seo"):
        out["showBlogCtas"] = True

    if has("faq"):
        out["showBeginnerFaqIntro"] = True

    if has("opinie", "social proof", "referenc", "licznik"):
        out["showPricingCaseStudies"] = True

    if has("pierwsze 30 dni"):
        out["showFirst30Days"] = True

    if has("start tutaj", "jak zaczac", "jak zaczac wspolprace"):
        out["showFirstTrainingSection"] = True

    if has("zablokowan", "niedostep", "brak polaczenia"):
        out["heroMode"] = "single-cta"
        out["singleContactCta"] = True
        out["showFirst30Days"] = True

    if confidence == "low" or any(
        host in source_low
        for host in ["instagram.com", "facebook.com", "duckduckgo.com"]
    ):
        out.setdefault("heroMode", "single-cta")
        out.setdefault("contactMode", "qualification-3q")
        out["singleContactCta"] = True

    if niche == "trening medyczny / fizjo":
        out["showProgramFit"] = True

    if niche == "trening + odzywianie":
        out["leadMagnetFollowup"] = True

    if niche == "metamorfoza sylwetki":
        out.setdefault("heroMode", "promise-packages")
        out.setdefault("singleContactCta", True)

    return out


def read_rows() -> list[dict]:
    with SOURCE_CSV.open("r", encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def build_profiles() -> tuple[dict, dict, list[tuple[str, str, str]], int]:
    rows = read_rows()
    by_email, by_name = parse_quickwins()

    profiles: dict[str, dict] = {}
    quick_overrides: dict[str, dict] = {}
    link_rows: list[tuple[str, str, str]] = []
    used_slugs: set[str] = set()
    matched_quickwins = 0

    for idx, row in enumerate(rows, start=1):
        title = normalize(row.get("title", ""))
        if not title:
            continue

        base_slug = f"poznan-{slugify_like_app(title) or f'lead-{idx}'}"
        slug = base_slug
        suffix = 2
        while slug in used_slugs:
            slug = f"{base_slug}-{suffix}"
            suffix += 1
        used_slugs.add(slug)

        email = first_email(row.get("email", ""))

        qrow = by_email.get(email.lower()) if email else None
        if not qrow:
            qrow = by_name.get(normalize_key(title))
        if qrow:
            matched_quickwins += 1

        quick_win = (
            qrow.quick_win
            if qrow
            else "Uproscic sciezke kontaktu i dodac jedno glowne CTA na stronie."
        )
        finding = (
            qrow.finding
            if qrow
            else "Profil lokalny wymaga dodatkowego testu UX i kontroli punktow kontaktu."
        )

        website = to_url(row.get("website", ""))
        instagram = to_url(row.get("instagram", ""))
        facebook = to_url(row.get("facebook", ""))

        if website and not instagram and "instagram.com" in website.lower():
            instagram = website
            website = ""
        if website and not facebook and "facebook.com" in website.lower():
            facebook = website
            website = ""

        source = (
            qrow.source
            if qrow and qrow.source
            else website or instagram or facebook or to_url(row.get("url", ""))
        )

        confidence = (
            qrow.confidence
            if qrow
            else ("high" if website else "medium" if instagram or facebook else "low")
        )

        category = normalize(row.get("category", "")) or "Trener osobisty"
        niche = infer_niche(title, category, quick_win, finding)
        preset = copy.deepcopy(NICHE_PRESETS[niche])

        rating_raw = normalize(row.get("rating", ""))
        try:
            rating = float(rating_raw.replace(",", ".")) if rating_raw else 5.0
        except ValueError:
            rating = 5.0

        profile = {
            "slug": slug,
            "fullName": title,
            "brandName": title,
            "navName": nav_name(title),
            "brandTagline": category,
            "city": "Poznań",
            "address": "Poznań",
            "category": category,
            "phone": normalize(row.get("phone", "")),
            "email": email,
            "website": website,
            "instagram": instagram,
            "facebook": facebook,
            "rating": round(rating, 1),
            "heroTitleTop": preset["hero_top"],
            "heroTitleAccent": preset["hero_accent"],
            "heroText": preset["hero_text"],
            "aboutHeading": f"{nav_name(title)} - trening personalny w Poznaniu.",
            "aboutText": f"{preset['about_text']} Priorytet quick win: {quick_win}",
            "nicheLabel": niche,
            "quickWin": quick_win,
            "researchCue": finding,
            "researchSource": source,
            "researchConfidence": confidence,
            "valueProps": preset["value_props"],
            "pricingPlans": preset["plans"],
            "faqItems": preset["faq"],
            "leadMagnetTitle": preset["lead_magnet_title"],
            "leadMagnetText": preset["lead_magnet_text"],
            "theme": pick_palette(slug),
        }

        profiles[slug] = profile

        override = build_quickwin_override(
            quick_win, finding, source, confidence, niche
        )
        if email and not override:
            if niche == "trening medyczny / fizjo":
                override = {"showProgramFit": True}
            elif niche == "trening + odzywianie":
                override = {"leadMagnetFollowup": True}
            else:
                override = {
                    "heroMode": "single-cta",
                    "singleContactCta": True,
                }
        if override:
            quick_overrides[slug] = override

        if email:
            link_rows.append((title, slug, email))

    return profiles, quick_overrides, link_rows, matched_quickwins


def write_profiles_ts(profiles: dict) -> None:
    payload = json.dumps(profiles, ensure_ascii=False, indent=2)
    content = (
        "import type { TrainerProfile } from './trainerProfile';\n\n"
        "export const poznanTrainerProfiles: Record<string, TrainerProfile> = "
        f"{payload};\n\n"
        "export const poznanTrainerSlugs = Object.keys(poznanTrainerProfiles);\n"
    )
    OUT_PROFILES_TS.write_text(content, encoding="utf-8")


def write_quickwin_ts(quick_overrides: dict) -> None:
    payload = json.dumps(quick_overrides, ensure_ascii=False, indent=2)
    content = f"export const poznanTrainerQuickWinOverrides = {payload} as const;\n"
    OUT_QW_TS.write_text(content, encoding="utf-8")


def write_links_md(link_rows: list[tuple[str, str, str]]) -> None:
    lines = [
        "# Linki localhost - trenerzy Poznan (z mailem)",
        "",
        "Host lokalny:",
        "- http://localhost:3000",
        "",
        "Host LAN:",
        f"- http://{LAN_HOST}:3000",
        "",
        "CRM:",
        "- http://localhost:3000/crm",
        f"- http://{LAN_HOST}:3000/crm",
        "",
        "## Strony trenerow",
        "",
    ]

    for index, (name, slug, email) in enumerate(link_rows, start=1):
        lines.append(f"{index}. {name} ({email})")
        lines.append(f"   - http://localhost:3000/?trainer={slug}")
        lines.append(f"   - http://{LAN_HOST}:3000/?trainer={slug}")

    lines.append("")
    OUT_LINKS_MD.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    profiles, quick_overrides, link_rows, matched_quickwins = build_profiles()
    write_profiles_ts(profiles)
    write_quickwin_ts(quick_overrides)
    write_links_md(link_rows)

    print(f"profiles={len(profiles)}")
    print(f"with_email_links={len(link_rows)}")
    print(f"quickwin_overrides={len(quick_overrides)}")
    print(f"matched_quickwins={matched_quickwins}")


if __name__ == "__main__":
    main()
