from __future__ import annotations

import csv
import hashlib
import html
import re
import unicodedata
from datetime import date
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
CONTACTS_CSV = ROOT / "outreach" / "deployed_contacts.csv"
PLAYBOOK_CSV = ROOT / "outreach" / "personalized_outreach_playbook.csv"

TODAY = date.today().isoformat()
OUT_TS = ROOT / "data" / "emailTrainerPersonalization.ts"
OUT_MD = ROOT / "reports" / f"email_trainers_research_{TODAY}.md"
OUT_CSV = ROOT / "reports" / f"email_trainers_copy_pack_{TODAY}.csv"

SOCIAL_HOSTS = (
    "instagram.com",
    "facebook.com",
    "fb.com",
    "tiktok.com",
    "youtube.com",
    "youtu.be",
    "booksy.com",
)

EXTRA_SOURCE_CANDIDATES = {
    "forever-athlete-vincent-marek": [
        "https://www.facebook.com/forverathlete.treningmotoryczny/",
        "https://www.instagram.com/v.m.coach/",
        "https://www.fresha.com/lvp/forever-athlete-vincent-marek-swiecka-bydgoszcz-GyyV2r",
    ],
    "kaja-narkun": [
        "https://zdrofit.pl/kadra/kaja-narkun-3",
        "https://www.instagram.com/narkoon/",
        "https://www.facebook.com/profile.php/?id=61570487873260",
    ],
    "maciej-karolczyk-trener-personalny": [
        "https://www.facebook.com/maciek.karolczyk/",
    ],
    "mikolaj-karaszewski-fitness-lifestyle": [
        "https://www.instagram.com/mikolaj.karaszewski/",
        "https://www.facebook.com/Trener-personalny-Miko%C5%82aj-Karaszewski-748142348570169/",
        "https://www.fresha.com/lvp/mikolaj-karaszewski-fitness-lifestyle-trener-osobisty-stanislawa-skarzynskiego-2MMgzB",
    ],
    "oskar-kaliszewski-trener-personalny": [
        "https://www.instagram.com/trener_oskar.kaliszewski/",
        "https://www.facebook.com/profile.php/?id=61568315265513",
    ],
    "patryk-kozikowski": [
        "https://repspolska.pl/index.php/trener/Patryk-Kozikowski/REPS-TR-6042",
        "https://www.instagram.com/patryk_koz4k/",
    ],
}


NICHE_PRESETS = {
    "trening medyczny / fizjo": {
        "hero_top": "TRENING MEDYCZNY",
        "hero_accents": [
            "BEZPIECZNIE I SKUTECZNIE.",
            "BEZ BOLU I PRZYPADKU.",
            "Z PLANEM DLA CIALA.",
        ],
        "hero_body": "Strategia oparta o diagnostyke ruchu, progres obciazen i jasny plan powrotu do formy.",
        "about_intro": "Oferta jest ustawiona pod klientow z bolem, po kontuzji i osoby, ktore chca trenowac bezpiecznie.",
        "props": [
            (
                "Sciezka bol -> forma",
                "Jasny podzial: osobna komunikacja dla problemow zdrowotnych i osobna dla celu sylwetkowego.",
            ),
            (
                "Diagnostyka + plan 12 tygodni",
                "Start od konsultacji i analizy ruchu, potem plan etapowy z mierzalnym progresem.",
            ),
            (
                "Case studies zamiast ogolnikow",
                "Wynik + czas wspolpracy + kontekst problemu, zeby budowac wiarygodnosc.",
            ),
        ],
        "plans": [
            {
                "name": "Start Bez Bolu",
                "subtitle": "Pierwsze 4 tygodnie pod kontrola.",
                "price": "299 zl",
                "period": "/ mies",
                "features": [
                    "Konsultacja + analiza ruchu",
                    "Plan medyczny dopasowany do objawow",
                    "Korekta techniki raz w tygodniu",
                ],
                "ctaLabel": "Wybieram Start Bez Bolu",
            },
            {
                "name": "Ruch + Sila",
                "subtitle": "Kompleksowe prowadzenie i progres.",
                "price": "599 zl",
                "period": "/ mies",
                "featured": True,
                "features": [
                    "Wszystko ze Start Bez Bolu",
                    "Plan silowy + mobilnosc + prewencja",
                    "Cotygodniowy raport i korekty",
                    "Kontakt biezacy 1:1",
                ],
                "ctaLabel": "Wybieram Ruch + Sila",
            },
            {
                "name": "Performance Care",
                "subtitle": "Dla osob z ambitnym celem.",
                "price": "999 zl",
                "period": "/ mies",
                "features": [
                    "Prowadzenie 1:1 premium",
                    "Priorytetowe konsultacje",
                    "Plan pod start lub sezon",
                ],
                "ctaLabel": "Wybieram Performance Care",
            },
        ],
        "faq": [
            (
                "Czy moge trenowac przy bolu plecow lub kolan?",
                "Tak, plan zaczyna sie od bezpiecznych zakresow ruchu i stopniowej progresji.",
            ),
            (
                "Jak szybko zobacze ulge?",
                "Pierwsze zmiany zwykle widac po 2-4 tygodniach regularnej pracy i korekcie nawykow.",
            ),
            (
                "Czy potrzebuje silowni?",
                "Nie, start mozliwy jest z podstawowym sprzetem i cwiczeniami domowymi.",
            ),
            (
                "Czy jest kontakt miedzy treningami?",
                "Tak, kontakt biezacy sluzy szybkiej korekcie i utrzymaniu bezpiecznego progresu.",
            ),
        ],
        "lead_magnet": (
            "Pobierz checkliste: 7 krokow treningu bez bolu",
            "Material startowy dla osob po kontuzji i z przeciazeniami - jak trenowac bezpiecznie i skutecznie.",
        ),
    },
    "metamorfoza sylwetki": {
        "hero_top": "METAMORFOZA",
        "hero_accents": [
            "KROK PO KROKU.",
            "Z PLANEM I WYNIKIEM.",
            "BEZ CHAOSU I LOSOWOSCI.",
        ],
        "hero_body": "Program ustawiony pod redukcje lub budowe sylwetki, z jasnym procesem i regularnym rozliczaniem progresu.",
        "about_intro": "Komunikacja strony skupia sie na realnych efektach, konkretnej sciezce wspolpracy i prostym CTA.",
        "props": [
            (
                "Sciezka pierwsze 30 dni",
                "Jasny plan startu: diagnoza, plan, pierwsze nawyki i pierwszy raport.",
            ),
            (
                "Dowody efektow",
                "Historie klientow z wynikiem, czasem i zakresem wspolpracy.",
            ),
            (
                "Jeden glowny CTA",
                "Krotka droga do kontaktu: formularz i szybka kwalifikacja.",
            ),
        ],
        "plans": [
            {
                "name": "Start Sylwetka",
                "subtitle": "Plan i wdrozenie na 4 tygodnie.",
                "price": "299 zl",
                "period": "/ mies",
                "features": [
                    "Indywidualny plan treningowy",
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
                    "Wszystko z Start Sylwetka",
                    "Plan zywieniowy i monitoring",
                    "Cotygodniowy raport i korekty",
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
                    "Strategia na 90 dni",
                    "Wsparcie premium i analiza wynikow",
                ],
                "ctaLabel": "Wybieram VIP Metamorfoza",
            },
        ],
        "faq": [
            (
                "Czy dam rade, jesli zaczynam od zera?",
                "Tak, program jest skalowany pod poziom startowy i tempo klienta.",
            ),
            (
                "Kiedy widac pierwsze efekty?",
                "Najczesciej po 3-4 tygodniach widac zmiany w obwodach i samopoczuciu.",
            ),
            (
                "Czy dieta jest restrykcyjna?",
                "Nie, priorytetem sa nawyki i plan, ktory da sie utrzymac dlugoterminowo.",
            ),
            (
                "Jak wyglada kontakt?",
                "Kontakt biezacy i cotygodniowy raport pomagaja utrzymac tempo progresu.",
            ),
        ],
        "lead_magnet": (
            "Pobierz plan: pierwsze 30 dni metamorfozy",
            "Gotowy start pod redukcje lub budowe sylwetki z checklistami i prostymi zasadami.",
        ),
    },
    "sport wytrzymalosciowy": {
        "hero_top": "TRENING SPORTOWY",
        "hero_accents": [
            "POD KONKRETNY CEL.",
            "SEZON ZA SEZONEM.",
            "Z PLANEM I MONITORINGIEM.",
        ],
        "hero_body": "Planowanie pod sezon, kontrola obciazen i przygotowanie motoryczne pod wynik sportowy.",
        "about_intro": "Oferta jest pozycjonowana pod sportowcow i ambitnych amatorow, ktorzy oczekuja mierzalnych rezultatow.",
        "props": [
            (
                "Diagnoza celu sezonu",
                "Plan oparty o termin startu, poziom i realne zasoby czasowe.",
            ),
            (
                "Monitoring obciazen",
                "Regularny raport pracy, regeneracji i realizacji zalozen.",
            ),
            (
                "Integracja sila + wytrzymalosc",
                "Spina trening uzupelniajacy z glowna dyscyplina.",
            ),
        ],
        "plans": [
            {
                "name": "Start Sezon",
                "subtitle": "Plan bazowy i kierunek przygotowan.",
                "price": "349 zl",
                "period": "/ mies",
                "features": [
                    "Analiza celu i kalendarza startow",
                    "Plan tygodniowy i strefy pracy",
                    "Korekta techniki i nawykow",
                ],
                "ctaLabel": "Wybieram Start Sezon",
            },
            {
                "name": "Plan Startowy Pro",
                "subtitle": "Prowadzenie pod wynik.",
                "price": "649 zl",
                "period": "/ mies",
                "featured": True,
                "features": [
                    "Wszystko ze Start Sezon",
                    "Cotygodniowa analiza i korekty",
                    "Integracja sila/mobilnosc/regen",
                    "Kontakt biezacy",
                ],
                "ctaLabel": "Wybieram Plan Startowy Pro",
            },
            {
                "name": "Race Premium",
                "subtitle": "Pelne wsparcie przed i w sezonie.",
                "price": "1099 zl",
                "period": "/ mies",
                "features": [
                    "Priorytetowe konsultacje",
                    "Dlugofalowa strategia wynikowa",
                    "Wsparcie startowe i mikrocykle",
                ],
                "ctaLabel": "Wybieram Race Premium",
            },
        ],
        "faq": [
            (
                "Czy program jest pod konkretny start?",
                "Tak, plan powstaje pod termin zawodow i aktualny poziom.",
            ),
            (
                "Czy laczysz trening silowy z dyscyplina?",
                "Tak, plan zawiera uzupelnienie silowo-motoryczne i regeneracje.",
            ),
            (
                "Jak monitorowany jest progres?",
                "Cotygodniowo analizujemy obciazenia, samopoczucie i realizacje planu.",
            ),
            (
                "Czy to tylko dla zawodowcow?",
                "Nie, program jest dla ambitnych amatorow i osob startujacych rekreacyjnie.",
            ),
        ],
        "lead_magnet": (
            "Pobierz mini-plan: przygotowanie do sezonu w 7 krokach",
            "Praktyczna checklista dla osob trenujacych wytrzymalosc i sporty sezonowe.",
        ),
    },
    "trening + odzywianie": {
        "hero_top": "FORMA + ODWZYWIANIE",
        "hero_accents": [
            "JEDEN SPOJNY SYSTEM.",
            "BEZ LOSOWYCH ROZPISKEK.",
            "POD REALNY CEL.",
        ],
        "hero_body": "Laczenie treningu z nawykami zyciowymi i odzywianiem, tak aby dowozic efekt bez skokow motywacji.",
        "about_intro": "Strona komunikuje pelna opieke: diagnoza celu, plan ruchu i plan zywieniowy w jednej sciezce.",
        "props": [
            (
                "Trening i dieta w jednym planie",
                "Jeden proces zamiast dwoch niespojnych uslug.",
            ),
            (
                "Formularz celu i nawykow",
                "Lepsza kwalifikacja klienta przed startem wspolpracy.",
            ),
            (
                "Automatyczny follow-up",
                "Szybsze domykanie leadow po pierwszym kontakcie.",
            ),
        ],
        "plans": [
            {
                "name": "Start Nawyki",
                "subtitle": "Prosty plan pod codziennosc.",
                "price": "349 zl",
                "period": "/ mies",
                "features": [
                    "Plan treningowy + zalecenia zywieniowe",
                    "Checklisty tygodniowe",
                    "Korekta raz w tygodniu",
                ],
                "ctaLabel": "Wybieram Start Nawyki",
            },
            {
                "name": "Metaboliczny Growth",
                "subtitle": "Prowadzenie pod wynik.",
                "price": "649 zl",
                "period": "/ mies",
                "featured": True,
                "features": [
                    "Wszystko z Start Nawyki",
                    "Plan posilkow i monitoring",
                    "Cotygodniowy raport + korekty",
                    "Kontakt biezacy",
                ],
                "ctaLabel": "Wybieram Metaboliczny Growth",
            },
            {
                "name": "Premium 360",
                "subtitle": "Maksymalne wsparcie 1:1.",
                "price": "1099 zl",
                "period": "/ mies",
                "features": [
                    "Pelna opieka trening + odzywianie",
                    "Priorytetowe konsultacje",
                    "Plan 90-dniowy i rewizje",
                ],
                "ctaLabel": "Wybieram Premium 360",
            },
        ],
        "faq": [
            (
                "Czy musze liczyc kazda kalorie?",
                "Nie zawsze, plan jest dopasowany do celu i preferencji klienta.",
            ),
            (
                "Czy to wspolpraca online czy stacjonarna?",
                "Mozliwe sa oba warianty, zalezne od pakietu i potrzeb.",
            ),
            (
                "Jak wyglada raportowanie postepu?",
                "Co tydzien weryfikujemy dane i aktualizujemy plan dzialania.",
            ),
            (
                "Czy plan jest dla osob zapracowanych?",
                "Tak, cala strategia jest ustawiona pod realny rytm dnia klienta.",
            ),
        ],
        "lead_magnet": (
            "Pobierz checkliste: trening + odzywianie na 7 dni",
            "Praktyczny punkt startu pod redukcje, energie i regularnosc bez skomplikowanych zasad.",
        ),
    },
    "trening personalny 1:1": {
        "hero_top": "TRENING 1:1",
        "hero_accents": [
            "DOPASOWANY DO CIEBIE.",
            "Z PLANEM I OPIEKA.",
            "BEZ PRZYPADKOWYCH METOD.",
        ],
        "hero_body": "Indywidualna wspolpraca 1:1 oparta o jasny plan, regularne korekty i prosty proces kontaktu.",
        "about_intro": "Oferta i strona sa ustawione pod szybkie zrozumienie: dla kogo jest usluga, jak wyglada start i co dalej.",
        "props": [
            (
                "Jasna oferta 3-pakietowa",
                "Koniec z chaosem: klient od razu widzi roznice miedzy pakietami.",
            ),
            (
                "Krotki formularz kwalifikacyjny",
                "Lepsza jakosc zapytan i szybsza decyzja o wspolpracy.",
            ),
            (
                "Sekcja pierwsze 30 dni",
                "Transparentny proces startu redukuje obawy klienta.",
            ),
        ],
        "plans": [
            {
                "name": "Start 1:1",
                "subtitle": "Plan i wdrozenie podstaw.",
                "price": "299 zl",
                "period": "/ mies",
                "features": [
                    "Plan treningowy dopasowany do celu",
                    "Instrukcje i korekta techniki",
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
                    "Wszystko z Start 1:1",
                    "Cotygodniowy raport i korekty",
                    "Plan odzywiania lub wskazowki",
                    "Kontakt biezacy",
                ],
                "ctaLabel": "Wybieram Prowadzenie 1:1",
            },
            {
                "name": "VIP Hybrid",
                "subtitle": "Opieka premium + konsultacje.",
                "price": "999 zl",
                "period": "/ mies",
                "features": [
                    "Priorytetowe wsparcie",
                    "Strategia 90 dni",
                    "Pelna personalizacja procesu",
                ],
                "ctaLabel": "Wybieram VIP Hybrid",
            },
        ],
        "faq": [
            (
                "Czy moge zaczac od zera?",
                "Tak, plan jest skalowany do poziomu i aktualnej sprawnosci.",
            ),
            (
                "Czy wspolpraca jest tylko stacjonarna?",
                "Nie, mozliwy jest model online lub hybrydowy.",
            ),
            (
                "Jak szybko odpisujesz po zgloszeniu?",
                "Najczesciej w 24h, z propozycja pierwszego kroku.",
            ),
            (
                "Czy dostane plan pod cel i czas?",
                "Tak, plan uwzglednia cel, kalendarz i realne mozliwosci tygodnia.",
            ),
        ],
        "lead_magnet": (
            "Pobierz plan startowy: pierwsze 7 dni wspolpracy",
            "Krotki przewodnik jak ruszyc z treningiem 1:1 i szybko utrzymac regularnosc.",
        ),
    },
}


def normalize(value: str | None) -> str:
    if not value:
        return ""
    return " ".join(value.replace("\xa0", " ").strip().split())


def to_ascii(value: str) -> str:
    mapped = value.translate(
        str.maketrans(
            {
                "\u0105": "a",
                "\u0107": "c",
                "\u0119": "e",
                "\u0142": "l",
                "\u0144": "n",
                "\u00f3": "o",
                "\u015b": "s",
                "\u017a": "z",
                "\u017c": "z",
                "\u0104": "A",
                "\u0106": "C",
                "\u0118": "E",
                "\u0141": "L",
                "\u0143": "N",
                "\u00d3": "O",
                "\u015a": "S",
                "\u0179": "Z",
                "\u017b": "Z",
            }
        )
    )
    normalized = unicodedata.normalize("NFKD", mapped)
    return "".join(ch for ch in normalized if ord(ch) < 128)


def slug_variant(slug: str, modulo: int) -> int:
    digest = hashlib.md5(slug.encode("utf-8")).hexdigest()
    return int(digest[:8], 16) % max(modulo, 1)


def dedupe(values: list[str]) -> list[str]:
    out: list[str] = []
    for value in values:
        v = normalize(value)
        if v and v not in out:
            out.append(v)
    return out


def looks_generic(value: str) -> bool:
    cue = to_ascii(normalize(value)).lower()
    if not cue:
        return True
    if cue in {"home", "start", "strona glowna", "trener personalny", "kontakt"}:
        return True
    return len(cue) < 14


def pick_best_cue(candidates: list[str], fallback: str) -> str:
    for candidate in candidates:
        item = normalize(candidate)
        if item and not looks_generic(item):
            return to_ascii(item)
    return to_ascii(normalize(fallback) or "profil trenera")


def host(url: str) -> str:
    try:
        return urlparse(url).netloc.lower().replace("www.", "")
    except Exception:
        return ""


def source_type(url: str) -> str:
    h = host(url)
    if not h:
        return "missing"
    if any(s in h for s in SOCIAL_HOSTS):
        return "social"
    if "fresha.com" in h or "zdrofit.pl" in h or "repspolska.pl" in h:
        return "directory"
    return "website"


def fetch_meta(url: str) -> dict[str, str]:
    if not normalize(url):
        return {
            "url": "",
            "status": "missing",
            "title": "",
            "h1": "",
            "h2": "",
            "desc": "",
            "error": "",
        }

    try:
        req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urlopen(req, timeout=12) as resp:
            raw = resp.read(600_000).decode("utf-8", errors="ignore")
            status = str(getattr(resp, "status", 200))
    except Exception as exc:
        return {
            "url": url,
            "status": "error",
            "title": "",
            "h1": "",
            "h2": "",
            "desc": "",
            "error": to_ascii(str(exc)),
        }

    def extract(pattern: str) -> str:
        match = re.search(pattern, raw, re.I | re.S)
        if not match:
            return ""
        value = re.sub(r"<[^>]+>", " ", match.group(1))
        return to_ascii(normalize(html.unescape(value)))

    return {
        "url": url,
        "status": status,
        "title": extract(r"<title[^>]*>(.*?)</title>")[:160],
        "h1": extract(r"<h1[^>]*>(.*?)</h1>")[:180],
        "h2": extract(r"<h2[^>]*>(.*?)</h2>")[:180],
        "desc": extract(
            r"<meta[^>]+name=[\"']description[\"'][^>]+content=[\"'](.*?)[\"']"
        )[:220],
        "error": "",
    }


def first_name(value: str) -> str:
    words = re.findall(r"[A-Za-z]+", to_ascii(value))
    stop = {
        "Trener",
        "Personalny",
        "Bydgoszcz",
        "Dietetyk",
        "Fitness",
        "Lifestyle",
        "Studio",
    }
    for word in words:
        if word and word not in stop:
            return word
    return words[0] if words else ""


def safe_sentence(value: str) -> str:
    text = normalize(to_ascii(value))
    if not text:
        return ""
    text = text[0].upper() + text[1:]
    if text.endswith((".", "?", "!")):
        return text
    return text + "."


def short_quick_win(value: str) -> str:
    text = safe_sentence(value)
    if len(text) <= 140:
        return text
    clipped = text[:140].rsplit(" ", 1)[0].rstrip(".,;:")
    return clipped + "."


def niche_for(value: str) -> str:
    niche = normalize(value)
    return niche if niche in NICHE_PRESETS else "trening personalny 1:1"


def choose_sources(base_url: str, slug: str) -> list[str]:
    values = [base_url]
    values.extend(EXTRA_SOURCE_CANDIDATES.get(slug, []))
    return dedupe(values)


def build_copy(
    slug: str,
    trainer_name: str,
    niche_label: str,
    cue: str,
    quick_win: str,
    confidence: str,
    source_url: str,
) -> dict:
    preset = NICHE_PRESETS[niche_for(niche_label)]
    hero_accent = preset["hero_accents"][
        slug_variant(slug, len(preset["hero_accents"]))
    ]
    cue_sentence = safe_sentence(cue)
    qwin_sentence = short_quick_win(quick_win)

    hero_text = (
        f"{preset['hero_body']} "
        "Dzialamy na planie dopasowanym do Twojego celu, poziomu i kalendarza tygodnia."
    )

    about_heading = (
        f"{trainer_name} - trening personalny z planem, ktory da sie utrzymac."
    )
    about_text = (
        f"{preset['about_intro']} "
        "Wspolprace zaczynamy od jasnego celu i prostego planu startowego, "
        "a potem regularnie korygujemy dzialania pod realny progres."
    )

    value_props = [
        {
            "title": "Start od konsultacji i diagnozy",
            "desc": "Najpierw ustalamy cel, poziom startowy i realny plan dzialania na pierwsze tygodnie.",
        }
    ]
    for title, desc in preset["props"]:
        value_props.append({"title": title, "desc": safe_sentence(desc)})

    lead_magnet_title, lead_magnet_text = preset["lead_magnet"]

    faq_items = [
        {"q": safe_sentence(q), "a": safe_sentence(a)} for q, a in preset["faq"]
    ]

    return {
        "heroTitleTop": preset["hero_top"],
        "heroTitleAccent": hero_accent,
        "heroText": safe_sentence(hero_text),
        "aboutHeading": about_heading,
        "aboutText": about_text,
        "nicheLabel": niche_label,
        "quickWin": qwin_sentence,
        "researchCue": cue_sentence,
        "researchSource": source_url,
        "researchConfidence": confidence or "medium",
        "valueProps": value_props,
        "pricingPlans": preset["plans"],
        "faqItems": faq_items,
        "leadMagnetTitle": safe_sentence(lead_magnet_title),
        "leadMagnetText": safe_sentence(lead_magnet_text),
    }


def ts_literal(value, indent: int = 0) -> str:
    pad = " " * indent
    if isinstance(value, str):
        escaped = value.replace("\\", "\\\\").replace('"', '\\"')
        return f'"{escaped}"'
    if isinstance(value, bool):
        return "true" if value else "false"
    if value is None:
        return "null"
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, list):
        if not value:
            return "[]"
        inner = ",\n".join(ts_literal(item, indent + 2) for item in value)
        return "[\n" + inner + "\n" + pad + "]"
    if isinstance(value, dict):
        if not value:
            return "{}"
        items = []
        for key, item in value.items():
            key_literal = (
                key if re.match(r"^[A-Za-z_][A-Za-z0-9_]*$", key) else f'"{key}"'
            )
            items.append(
                " " * (indent + 2) + f"{key_literal}: {ts_literal(item, indent + 2)}"
            )
        return "{\n" + ",\n".join(items) + "\n" + pad + "}"
    return '""'


def write_typescript(overrides: dict[str, dict]) -> None:
    lines: list[str] = []
    lines.append("import type { TrainerProfile } from './trainerProfile';")
    lines.append("")
    lines.append("export type TrainerProfileOverride = Partial<TrainerProfile>;")
    lines.append("")
    lines.append(
        "export const emailTrainerPersonalization: Record<string, TrainerProfileOverride> = "
        + ts_literal(overrides, 0)
        + ";"
    )
    lines.append("")
    OUT_TS.write_text("\n".join(lines), encoding="utf-8")


def write_markdown(research_rows: list[dict]) -> None:
    lines: list[str] = []
    lines.append(f"# Email Trainers Research + Copy Pack ({TODAY})")
    lines.append("")
    lines.append(
        "Scope: all trainers with non-empty email in outreach/deployed_contacts.csv."
    )
    lines.append("")

    total = len(research_rows)
    verified = sum(1 for row in research_rows if row["email_status"] == "verified")
    risky = sum(1 for row in research_rows if row["email_status"] == "risky")
    by_source = {
        "website": sum(
            1 for row in research_rows if row["detected_source_type"] == "website"
        ),
        "social": sum(
            1 for row in research_rows if row["detected_source_type"] == "social"
        ),
        "directory": sum(
            1 for row in research_rows if row["detected_source_type"] == "directory"
        ),
        "missing": sum(
            1 for row in research_rows if row["detected_source_type"] == "missing"
        ),
    }

    lines.append("## Snapshot")
    lines.append(f"- trainers with email: {total}")
    lines.append(f"- email status: verified={verified}, risky={risky}")
    lines.append(
        "- source quality: "
        f"website={by_source['website']}, social={by_source['social']}, "
        f"directory={by_source['directory']}, missing={by_source['missing']}"
    )
    lines.append("- generated deliverables:")
    lines.append(f"  - {OUT_TS.relative_to(ROOT)}")
    lines.append(f"  - {OUT_CSV.relative_to(ROOT)}")
    lines.append("")

    lines.append("## Method")
    lines.append(
        "- Input data: deployed_contacts.csv + personalized_outreach_playbook.csv"
    )
    lines.append(
        "- Research signals: source URL, title/h1/h2/meta description when fetchable"
    )
    lines.append(
        "- Existing quick win from playbook is preserved as implementation checklist"
    )
    lines.append(
        "- Confidence from playbook kept, then annotated with detected source type"
    )
    lines.append("")

    lines.append("## Per-trainer brief")
    for row in research_rows:
        lines.append("")
        lines.append(f"### {row['title']} ({row['slug']})")
        lines.append(
            f"- contact: {row['email']} ({row['email_status']}) | phone: {row['phone'] or '-'}"
        )
        lines.append(
            f"- segment: {row['niche']} | confidence: {row['confidence']} | detected source: {row['detected_source_type']}"
        )
        lines.append(f"- source used: {row['source_used'] or '-'}")
        lines.append(f"- source cues: {row['meta_cues'] or '-'}")
        lines.append(f"- positioning cue: {row['cue']} ")
        lines.append(f"- quick win (existing): {row['quick_win']}")
        lines.append(f"- generated hero: {row['hero_top']} / {row['hero_accent']}")
        lines.append(f"- generated CTA focus: {row['cta_focus']}")

    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_csv(research_rows: list[dict]) -> None:
    fields = [
        "slug",
        "title",
        "email",
        "email_status",
        "phone",
        "niche",
        "confidence",
        "detected_source_type",
        "source_used",
        "meta_cues",
        "cue",
        "quick_win",
        "hero_top",
        "hero_accent",
        "hero_text",
        "about_text",
        "cta_focus",
    ]
    with OUT_CSV.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=fields)
        writer.writeheader()
        for row in research_rows:
            writer.writerow({field: row.get(field, "") for field in fields})


def main() -> None:
    contacts = list(
        csv.DictReader(CONTACTS_CSV.open("r", encoding="utf-8-sig", newline=""))
    )
    playbook = list(
        csv.DictReader(PLAYBOOK_CSV.open("r", encoding="utf-8-sig", newline=""))
    )
    by_slug = {normalize(row.get("slug")): row for row in playbook}

    rows = [row for row in contacts if normalize(row.get("email"))]
    overrides: dict[str, dict] = {}
    research_rows: list[dict] = []

    for row in rows:
        slug = normalize(row.get("slug"))
        title = to_ascii(normalize(row.get("title")))
        email = normalize(row.get("email"))
        email_status = normalize(row.get("email_status"))
        phone = normalize(row.get("phone"))
        website = normalize(row.get("website"))

        play = by_slug.get(slug, {})
        niche = niche_for(play.get("niche") or "trening personalny 1:1")
        quick_win = to_ascii(
            normalize(play.get("quick_win")) or "Uproscic sciezke do kontaktu i CTA"
        )
        confidence = normalize(play.get("confidence") or "medium")
        cue_playbook = to_ascii(normalize(play.get("opener_line")))

        sources = choose_sources(website, slug)
        best_meta = {
            "url": "",
            "status": "missing",
            "title": "",
            "h1": "",
            "h2": "",
            "desc": "",
            "error": "",
        }

        for source_url in sources:
            meta = fetch_meta(source_url)
            if best_meta["status"] == "missing":
                best_meta = meta
            if normalize(meta.get("h1")) or normalize(meta.get("title")):
                best_meta = meta
                break

        cues = [
            best_meta.get("h1", ""),
            best_meta.get("h2", ""),
            best_meta.get("title", ""),
            best_meta.get("desc", ""),
            cue_playbook,
        ]
        cue = pick_best_cue(cues, cue_playbook or title)

        trainer_name = first_name(play.get("first_name") or title) or first_name(title)
        copy_data = build_copy(
            slug=slug,
            trainer_name=trainer_name or title,
            niche_label=niche,
            cue=cue,
            quick_win=quick_win,
            confidence=confidence,
            source_url=best_meta.get("url", "") or website,
        )
        overrides[slug] = copy_data

        cues_list = [
            normalize(best_meta.get("title")),
            normalize(best_meta.get("h1")),
            normalize(best_meta.get("h2")),
        ]
        meta_cues = " | ".join([to_ascii(item) for item in cues_list if item][:3])

        research_rows.append(
            {
                "slug": slug,
                "title": title,
                "email": email,
                "email_status": email_status,
                "phone": phone,
                "niche": niche,
                "confidence": confidence,
                "detected_source_type": source_type(
                    best_meta.get("url", "") or website
                ),
                "source_used": best_meta.get("url", "") or website,
                "meta_cues": meta_cues,
                "cue": cue,
                "quick_win": copy_data["quickWin"],
                "hero_top": copy_data["heroTitleTop"],
                "hero_accent": copy_data["heroTitleAccent"],
                "hero_text": copy_data["heroText"],
                "about_text": copy_data["aboutText"],
                "cta_focus": copy_data["pricingPlans"][1]["ctaLabel"]
                if len(copy_data["pricingPlans"]) > 1
                else copy_data["pricingPlans"][0]["ctaLabel"],
            }
        )

    overrides = dict(sorted(overrides.items(), key=lambda item: item[0]))
    research_rows = sorted(research_rows, key=lambda item: item["slug"])

    write_typescript(overrides)
    write_markdown(research_rows)
    write_csv(research_rows)

    print(f"generated={OUT_TS}")
    print(f"generated={OUT_MD}")
    print(f"generated={OUT_CSV}")
    print(f"rows={len(research_rows)}")


if __name__ == "__main__":
    main()
