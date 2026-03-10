from __future__ import annotations

import csv
import hashlib
import json
import re
import unicodedata
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_CSV = ROOT / "data" / "torun_trenerzy_personalny_2024.csv"
OUT_PROFILES_TS = ROOT / "data" / "torunTrainerProfiles.ts"
OUT_QW_TS = ROOT / "data" / "torunTrainerQuickWinOverrides.ts"
OUT_LINKS_MD = ROOT.parent / "Torun" / "localhost_links_torun_email_trainers.md"

PL_TRANSLIT = str.maketrans(
    {
        "ą": "a",
        "ć": "c",
        "ę": "e",
        "ł": "l",
        "ń": "n",
        "ó": "o",
        "ś": "s",
        "ź": "z",
        "ż": "z",
        "Ą": "A",
        "Ć": "C",
        "Ę": "E",
        "Ł": "L",
        "Ń": "N",
        "Ó": "O",
        "Ś": "S",
        "Ź": "Z",
        "Ż": "Z",
    }
)


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
        "about_text": "Praca z osobami po kontuzjach, przeciążeniami i celem bezpiecznego powrotu do formy.",
        "value_props": [
            {
                "title": "Start od konsultacji",
                "desc": "Najpierw diagnoza ruchowa i jasny plan pierwszych 4 tygodni.",
            },
            {
                "title": "Sciezka bol -> forma",
                "desc": "Plan prowadzi od bezpiecznych wzorcow ruchu do regularnego treningu.",
            },
            {
                "title": "Cotygodniowa korekta",
                "desc": "Regulujemy obciazenie i technike na podstawie realnych reakcji ciala.",
            },
            {
                "title": "Wyniki mierzalne",
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
                "a": "Pierwsze zmiany zwykle pojawiaja sie po 2-4 tygodniach regularnej pracy.",
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
                "desc": "Jasny start: diagnoza, plan i pierwsze nawyki bez przeciazenia.",
            },
            {
                "title": "Dowody efektow",
                "desc": "Case studies z wynikiem, czasem wspolpracy i kontekstem klienta.",
            },
            {
                "title": "Jeden glowny CTA",
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
                "desc": "Od pierwszej konsultacji wiesz, co robic i jak mierzyc efekt.",
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
                "q": "Czy moge zaczac, jesli mam nieregularny tryb pracy?",
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
                "title": "Jasna oferta 3 pakietow",
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


NORM_QUICK_WIN = {
    "karolina lapinska trenerka medyczna": "Dodac cennik 3 pakietow i uzupelnic linki social (IG/FB).",
    "kany personal": "Uruchomic 1-page landing: oferta, 3 pakiety i jedno glowne CTA.",
    "has academy studio treningu personalnego": "Dodac szybka rezerwacje konsultacji (Booksy lub kalendarz).",
    "fit room by zawada": "Uruchomic 1-page landing i uzupelnic linki social (IG/FB).",
    "poprostu silka nikola detmer trening medyczny": "Uruchomic 1-page landing i uzupelnic linki social (IG/FB).",
    "trener personalny piotr sieminski": "Dodac cennik 3 pakietow, formularz lead i szybka rezerwacje konsultacji.",
    "trener personalny pawel baranski": "Dodac cennik 3 pakietow, formularz lead i sekcje opinii z Google.",
    "trener personalny sebastian trenuje": "Uruchomic 1-page landing i uzupelnic linki social (IG/FB).",
    "body development mateusz golus": "Dodac szybka rezerwacje konsultacji (Booksy lub kalendarz).",
    "pure power studio treningu personalnego": "Uruchomic 1-page landing i uzupelnic linki social (IG/FB).",
    "radek skonieczny trener personalny": "Naprawic dzialajaca strone WWW i uzupelnic linki social (IG/FB).",
    "just pilates torun justyna krauze": "Uruchomic 1-page landing i uzupelnic linki social (IG/FB).",
    "anaboliczny trener": "Dodac szybka rezerwacje konsultacji i mocniejsze CTA na stronie glownej.",
    "speedfit ems by paula wisienka": "Dodac szybka rezerwacje konsultacji (Booksy lub kalendarz).",
    "4ever young studio treningowe": "Naprawic dzialajaca strone WWW i uzupelnic linki social (IG/FB).",
    "i m studio trening personalny terapia ruchem": "Dodac sekcje opinii i gwiazdki Google na stronie glownej.",
    "adam zielinski": "Uruchomic 1-page landing: oferta, 3 pakiety i jedno glowne CTA.",
    "polak academy ems personal training": "Dodac cennik 3 pakietow, formularz lead i szybka rezerwacje konsultacji.",
    "twardy fitness center": "Dodac cennik 3 pakietow, formularz lead i szybka rezerwacje konsultacji.",
    "dryla pro": "Dodac szybka rezerwacje konsultacji (Booksy lub kalendarz).",
    "trenner nina nadolny": "Uruchomic 1-page landing: oferta, 3 pakiety i jedno glowne CTA.",
    "masterfizjotrener": "Uruchomic 1-page landing i uzupelnic linki social (IG/FB).",
    "fizjoterapia chaustowicz": "Dodac cennik 3 pakietow, sekcje opinii i szybka rezerwacje konsultacji.",
    "fitpaulis": "Przeniesc kontakt na skrzynke domenowa dla mocniejszego wizerunku premium.",
    "przyjazny dietetyk torun radoslaw sialkowski": "Dodac cennik 3 pakietow i uproscic sciezke do kontaktu.",
}


NORM_NICHE = {
    "karolina lapinska trenerka medyczna": "trening medyczny / fizjo",
    "poprostu silka nikola detmer trening medyczny": "trening medyczny / fizjo",
    "just pilates torun justyna krauze": "trening medyczny / fizjo",
    "masterfizjotrener": "trening medyczny / fizjo",
    "fizjoterapia chaustowicz": "trening medyczny / fizjo",
    "przyjazny dietetyk torun radoslaw sialkowski": "trening + odzywianie",
    "anaboliczny trener": "metamorfoza sylwetki",
}


NO_WEBSITE_NAMES = {
    "kany personal",
    "fit room by zawada",
    "poprostu silka nikola detmer trening medyczny",
    "trener personalny sebastian trenuje",
    "pure power studio treningu personalnego",
    "just pilates torun justyna krauze",
    "adam zielinski",
    "trenner nina nadolny",
    "masterfizjotrener",
}

BROKEN_WEBSITE_NAMES = {
    "radek skonieczny trener personalny",
    "4ever young studio treningowe",
}

BOOKING_NAMES = {
    "has academy studio treningu personalnego",
    "trener personalny piotr sieminski",
    "body development mateusz golus",
    "anaboliczny trener",
    "speedfit ems by paula wisienka",
    "polak academy ems personal training",
    "twardy fitness center",
    "dryla pro",
    "fizjoterapia chaustowicz",
}

FORM_NAMES = {
    "trener personalny piotr sieminski",
    "trener personalny pawel baranski",
    "polak academy ems personal training",
    "twardy fitness center",
}

REVIEWS_NAMES = {
    "trener personalny pawel baranski",
    "i m studio trening personalny terapia ruchem",
    "fizjoterapia chaustowicz",
}


def normalize(value: str) -> str:
    return re.sub(r"\s+", " ", (value or "").replace("\xa0", " ")).strip()


def normalize_key(value: str) -> str:
    value = normalize(value).translate(PL_TRANSLIT)
    value = unicodedata.normalize("NFKD", value)
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def slugify(value: str) -> str:
    value = normalize(value).translate(PL_TRANSLIT)
    value = unicodedata.normalize("NFKD", value)
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
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
    if ";" in value:
        return normalize(value.split(";", 1)[0])
    return value


def pick_palette(slug: str) -> dict:
    idx = int(hashlib.md5(slug.encode("utf-8")).hexdigest(), 16) % len(PALETTES)
    return PALETTES[idx]


def pick_niche(name_key: str) -> str:
    if name_key in NORM_NICHE:
        return NORM_NICHE[name_key]
    return "trening personalny 1:1"


def nav_name(name: str) -> str:
    short = re.split(r"\||-", name)[0].strip()
    if len(short) >= 4:
        return short
    return name


def quick_win_for(name_key: str) -> str:
    return NORM_QUICK_WIN.get(
        name_key, "Uproscic sciezke kontaktu i dodac jedno glowne CTA."
    )


def quick_win_override(name_key: str, niche: str) -> dict:
    out: dict = {}

    if name_key in NO_WEBSITE_NAMES or name_key in BROKEN_WEBSITE_NAMES:
        out.update(
            {
                "heroMode": "single-cta",
                "contactMode": "qualification-3q",
                "singleContactCta": True,
                "showFirst30Days": True,
            }
        )

    if name_key in BOOKING_NAMES:
        out.update({"showConsultationCalendar": True, "stickyMode": "consult-15"})

    if name_key in FORM_NAMES:
        out.update({"contactMode": "qualification-3q", "singleContactCta": True})

    if name_key in REVIEWS_NAMES:
        out.update({"showPricingCaseStudies": True})

    if niche == "trening medyczny / fizjo":
        out.update({"showProgramFit": True})

    if niche == "trening + odzywianie":
        out.update({"leadMagnetFollowup": True})

    if niche == "metamorfoza sylwetki" and "heroMode" not in out:
        out.update({"heroMode": "promise-packages", "singleContactCta": True})

    return out


POLISH_REPLACEMENTS = [
    ("TWOJ", "TWÓJ"),
    ("Twoj", "Twój"),
    ("twoj", "twój"),
    ("Swoj", "Swój"),
    ("swoj", "swój"),
    ("Wspolpraca", "Współpraca"),
    ("wspolpraca", "współpraca"),
    ("Wspolpracy", "Współpracy"),
    ("wspolpracy", "współpracy"),
    ("prosta sciezke", "prostą ścieżkę"),
    ("Prosta sciezke", "Prostą ścieżkę"),
    ("sciezke", "ścieżkę"),
    ("Sciezke", "Ścieżkę"),
    ("sciezka", "ścieżka"),
    ("Sciezka", "Ścieżka"),
    ("sciezki", "ścieżki"),
    ("Sciezki", "Ścieżki"),
    ("sciezce", "ścieżce"),
    ("Sciezce", "Ścieżce"),
    ("wskazowki", "wskazówki"),
    ("Wskazowki", "Wskazówki"),
    ("wiecej", "więcej"),
    ("Wiecej", "Więcej"),
    ("miedzy", "między"),
    ("Miedzy", "Między"),
    ("krotki", "krótki"),
    ("Krotki", "Krótki"),
    ("moge", "mogę"),
    ("Moge", "Mogę"),
    ("zaczac", "zacząć"),
    ("Zaczac", "Zacząć"),
    ("trenowac", "trenować"),
    ("Trenowac", "Trenować"),
    ("wyglada", "wygląda"),
    ("Wyglada", "Wygląda"),
    ("dam rade", "dam radę"),
    ("Dam rade", "Dam radę"),
    ("checkliste", "checklistę"),
    ("Checkliste", "Checklistę"),
    ("krokow", "kroków"),
    ("Krokow", "Kroków"),
    ("redukcje", "redukcję"),
    ("Redukcje", "Redukcję"),
    ("budowe", "budowę"),
    ("Budowe", "Budowę"),
    ("postepu", "postępu"),
    ("Postepu", "Postępu"),
    ("poprawic", "poprawić"),
    ("Poprawic", "Poprawić"),
    ("jesli", "jeśli"),
    ("Jesli", "Jeśli"),
    ("ktore", "które"),
    ("Ktore", "Które"),
    ("ktory", "który"),
    ("Ktory", "Który"),
    ("ktorym", "którym"),
    ("Ktorym", "Którym"),
    ("sylwetke", "sylwetkę"),
    ("Sylwetke", "Sylwetkę"),
    ("bolu", "bólu"),
    ("Bolu", "Bólu"),
    ("plecow", "pleców"),
    ("Plecow", "Pleców"),
    ("miesni", "mięśni"),
    ("Miesni", "Mięśni"),
    ("cwiczen", "ćwiczeń"),
    ("Cwiczen", "Ćwiczeń"),
    ("cwiczyc", "ćwiczyć"),
    ("Cwiczyc", "Ćwiczyć"),
    ("uzupelnic", "uzupełnić"),
    ("Uzupelnic", "Uzupełnić"),
    ("dodac", "dodać"),
    ("Dodac", "Dodać"),
    ("pakietow", "pakietów"),
    ("Pakietow", "Pakietów"),
    ("rezerwacje", "rezerwację"),
    ("Rezerwacje", "Rezerwację"),
    ("wzorcow", "wzorców"),
    ("Wzorcow", "Wzorców"),
    ("obciazenie", "obciążenie"),
    ("Obciazenie", "Obciążenie"),
    ("technike", "technikę"),
    ("Technike", "Technikę"),
    ("ciala", "ciała"),
    ("Ciala", "Ciała"),
    ("najwazniejsze", "najważniejsze"),
    ("Najwazniejsze", "Najważniejsze"),
    ("miesiac", "miesiąc"),
    ("Miesiac", "Miesiąc"),
    ("miesiacu", "miesiącu"),
    ("Miesiacu", "Miesiącu"),
    ("wspolne", "wspólne"),
    ("Wspolne", "Wspólne"),
    ("oparta o", "oparta na"),
    ("Oparta o", "Oparta na"),
    ("oparta na jasny plan", "oparta na jasnym planie"),
    ("Oparta na jasny plan", "Oparta na jasnym planie"),
    ("oparta na analize ruchu", "oparta na analizie ruchu"),
    ("Oparta na analize ruchu", "Oparta na analizie ruchu"),
    ("oparta na analizę ruchu", "oparta na analizie ruchu"),
    ("Oparta na analizę ruchu", "Oparta na analizie ruchu"),
    ("progresje", "progresję"),
    ("Progresje", "Progresję"),
    ("bezpieczna progresję", "bezpieczną progresję"),
    ("analize", "analizę"),
    ("Analize", "Analizę"),
    ("miesiecy", "miesięcy"),
    ("Miesiecy", "Miesięcy"),
    ("miesieczny", "miesięczny"),
    ("Miesieczny", "Miesięczny"),
    ("miesiecznego", "miesięcznego"),
    ("Miesiecznego", "Miesięcznego"),
    ("umow", "umów"),
    ("Umow", "Umów"),
    ("Laczymy", "Łączymy"),
    ("laczymy", "łączymy"),
    ("laczycie", "łączycie"),
    ("Laczycie", "Łączycie"),
    ("odzywianie", "odżywianie"),
    ("Odzywianie", "Odżywianie"),
    ("odzywiania", "odżywiania"),
    ("Odzywiania", "Odżywiania"),
    ("zeby", "żeby"),
    ("Zeby", "Żeby"),
    ("byl", "był"),
    ("Byl", "Był"),
    ("uproscic", "uprościć"),
    ("Uproscic", "Uprościć"),
    ("chca", "chcą"),
    ("Chca", "Chcą"),
    ("osobami", "osobami"),
    ("przeciazeniami", "przeciążeniami"),
    ("powrotu", "powrotu"),
    ("glowne", "główne"),
    ("Glowne", "Główne"),
    ("glownej", "głównej"),
    ("Glownej", "Głównej"),
    ("regularnosci", "regularności"),
    ("Regularnosci", "Regularności"),
    ("regularnosc", "regularność"),
    ("Regularnosc", "Regularność"),
    ("sie", "się"),
    ("wdrozenie", "wdrożenie"),
    ("Wdrozenie", "Wdrożenie"),
    ("Uruchomic", "Uruchomić"),
    ("uruchomic", "uruchomić"),
    ("Naprawic", "Naprawić"),
    ("naprawic", "naprawić"),
    ("dzialajaca", "działającą"),
    ("Dzialajaca", "Działającą"),
    ("sekcje", "sekcję"),
    ("Sekcje", "Sekcję"),
    ("ruszyc", "ruszyć"),
    ("Ruszyc", "Ruszyć"),
    ("utrzymac", "utrzymać"),
    ("Utrzymac", "Utrzymać"),
    ("szybka rezerwację", "szybką rezerwację"),
    ("Szybka rezerwację", "Szybką rezerwację"),
    ("codzieńnego", "codziennego"),
    ("mobilnosc", "mobilność"),
    ("Mobilnosc", "Mobilność"),
]


def polishify(value: str) -> str:
    out = value
    for old, new in POLISH_REPLACEMENTS:
        if re.fullmatch(r"[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]+", old):
            out = re.sub(rf"\b{re.escape(old)}\b", new, out)
        else:
            out = out.replace(old, new)
    return out


def polishify_profile(profile: dict) -> dict:
    profile["brandTagline"] = polishify(profile["brandTagline"])
    profile["heroTitleTop"] = polishify(profile["heroTitleTop"])
    profile["heroTitleAccent"] = polishify(profile["heroTitleAccent"])
    profile["heroText"] = polishify(profile["heroText"])
    profile["aboutHeading"] = polishify(profile["aboutHeading"])
    profile["aboutText"] = polishify(profile["aboutText"])
    profile["nicheLabel"] = polishify(profile["nicheLabel"])
    profile["quickWin"] = polishify(profile["quickWin"])
    profile["researchCue"] = polishify(profile["researchCue"])
    profile["leadMagnetTitle"] = polishify(profile["leadMagnetTitle"])
    profile["leadMagnetText"] = polishify(profile["leadMagnetText"])

    profile["valueProps"] = [
        {"title": polishify(item["title"]), "desc": polishify(item["desc"])}
        for item in profile["valueProps"]
    ]
    profile["pricingPlans"] = [
        {
            **plan,
            "name": polishify(plan["name"]),
            "subtitle": polishify(plan["subtitle"]),
            "ctaLabel": polishify(plan["ctaLabel"]),
            "features": [polishify(feature) for feature in plan["features"]],
        }
        for plan in profile["pricingPlans"]
    ]
    profile["faqItems"] = [
        {"q": polishify(item["q"]), "a": polishify(item["a"])}
        for item in profile["faqItems"]
    ]

    return profile


def read_rows() -> list[dict]:
    with SOURCE_CSV.open("r", encoding="utf-8", newline="") as f:
        rows = list(csv.DictReader(f))
    return [row for row in rows if first_email(row.get("Email", ""))]


def build_profiles(rows: list[dict]) -> tuple[dict, dict, list[tuple[str, str]]]:
    profiles: dict[str, dict] = {}
    quick_overrides: dict[str, dict] = {}
    used: set[str] = set()
    link_rows: list[tuple[str, str]] = []

    for row in rows:
        name = normalize(row.get("Nazwa", ""))
        if not name:
            continue

        base_slug = f"torun-{slugify(name)}"
        slug = base_slug
        i = 2
        while slug in used:
            slug = f"{base_slug}-{i}"
            i += 1
        used.add(slug)

        name_key = normalize_key(name)
        niche = pick_niche(name_key)
        preset = NICHE_PRESETS[niche]
        palette = pick_palette(slug)

        rating_raw = normalize(row.get("Ocena", ""))
        try:
            rating = float(rating_raw.replace(",", ".")) if rating_raw else 5.0
        except ValueError:
            rating = 5.0

        email = first_email(row.get("Email", ""))
        website = to_url(row.get("Strona WWW", ""))
        facebook = to_url(row.get("Facebook", ""))
        instagram = to_url(row.get("Instagram", ""))
        address = normalize(row.get("Adres", "")) or "Toruń"
        category = normalize(row.get("Kategoria", "")) or "Trener osobisty"

        quick_win = quick_win_for(name_key)
        source_used = website or instagram or facebook
        profile = {
            "slug": slug,
            "fullName": name,
            "brandName": name,
            "navName": nav_name(name),
            "brandTagline": category,
            "city": "Toruń",
            "address": address,
            "category": category,
            "phone": normalize(row.get("Telefon", "")),
            "email": email,
            "website": website,
            "instagram": instagram,
            "facebook": facebook,
            "rating": round(rating, 1),
            "heroTitleTop": preset["hero_top"],
            "heroTitleAccent": preset["hero_accent"],
            "heroText": preset["hero_text"],
            "aboutHeading": f"{nav_name(name)} - trening personalny w Toruniu.",
            "aboutText": f"{preset['about_text']} Priorytet na stronie: {quick_win}",
            "nicheLabel": niche,
            "quickWin": quick_win,
            "researchCue": f"Profil lokalny: {name}",
            "researchSource": source_used,
            "researchConfidence": "high" if website else "medium",
            "valueProps": preset["value_props"],
            "pricingPlans": preset["plans"],
            "faqItems": preset["faq"],
            "leadMagnetTitle": preset["lead_magnet_title"],
            "leadMagnetText": preset["lead_magnet_text"],
            "theme": palette,
        }

        profile = polishify_profile(profile)

        profiles[slug] = profile
        quick_overrides[slug] = quick_win_override(name_key, niche)
        link_rows.append((name, slug))

    return profiles, quick_overrides, link_rows


def write_profiles_ts(profiles: dict) -> None:
    payload = json.dumps(profiles, ensure_ascii=False, indent=2)
    content = (
        "import type { TrainerProfile } from './trainerProfile';\n\n"
        "export const torunTrainerProfiles: Record<string, TrainerProfile> = "
        f"{payload};\n\n"
        "export const torunTrainerSlugs = Object.keys(torunTrainerProfiles);\n"
    )
    OUT_PROFILES_TS.write_text(content, encoding="utf-8")


def write_quickwin_ts(quick_overrides: dict) -> None:
    filtered = {slug: cfg for slug, cfg in quick_overrides.items() if cfg}
    payload = json.dumps(filtered, ensure_ascii=False, indent=2)
    content = f"export const torunTrainerQuickWinOverrides = {payload} as const;\n"
    OUT_QW_TS.write_text(content, encoding="utf-8")


def write_links_md(link_rows: list[tuple[str, str]]) -> None:
    lines = [
        "# Linki localhost - trenerzy Torun (z mailem)",
        "",
        "Host lokalny:",
        "- http://localhost:3000",
        "",
        "Host LAN:",
        "- http://192.168.0.175:3000",
        "",
        "CRM:",
        "- http://localhost:3000/crm",
        "- http://192.168.0.175:3000/crm",
        "",
        "## Strony trenerow",
        "",
    ]
    for idx, (name, slug) in enumerate(link_rows, start=1):
        lines.append(f"{idx}. {name}")
        lines.append(f"   - http://localhost:3000/?trainer={slug}")
        lines.append(f"   - http://192.168.0.175:3000/?trainer={slug}")
    lines.append("")
    OUT_LINKS_MD.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    rows = read_rows()
    profiles, quick_overrides, link_rows = build_profiles(rows)
    write_profiles_ts(profiles)
    write_quickwin_ts(quick_overrides)
    write_links_md(link_rows)
    print(f"profiles={len(profiles)}")
    print(f"quickwin_overrides={sum(1 for v in quick_overrides.values() if v)}")


if __name__ == "__main__":
    main()
