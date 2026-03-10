from __future__ import annotations

import csv
import hashlib
import html
import re
import unicodedata
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
CONTACTS_CSV = ROOT / "outreach" / "deployed_contacts.csv"
REVIEW_CSV = ROOT / "outreach" / "deployed_sites_email_vercel_review.csv"
OUT_CSV = ROOT / "outreach" / "personalized_outreach_playbook.csv"

SOCIAL_HOSTS = (
    "instagram.com",
    "facebook.com",
    "fb.com",
    "tiktok.com",
    "youtube.com",
    "youtu.be",
    "booksy.com",
)

SEGMENT_LABELS = {
    "medyczny": "trening medyczny / fizjo",
    "metamorfoza": "metamorfoza sylwetki",
    "sport_endurance": "sport wytrzymalosciowy",
    "dietetyka": "trening + odzywianie",
    "mobility": "mobilnosc / kobiety",
    "ogolny_1_1": "trening personalny 1:1",
}

SEGMENT_PATTERNS = {
    "medyczny": [r"medycz", r"fizjo", r"rehabil", r"kontuz", r"bol", r"prozdrow"],
    "metamorfoza": [r"metamorfoz", r"redukc", r"sylwet", r"spal", r"masa mies"],
    "sport_endurance": [
        r"triathlon",
        r"mtb",
        r"bieg",
        r"maraton",
        r"plywan",
        r"wytrzym",
    ],
    "dietetyka": [r"diet", r"zywien", r"odzyw"],
    "mobility": [r"pilates", r"mobility", r"rozciag", r"kobiet", r"postura"],
    "ogolny_1_1": [r"trener personal", r"trening personal", r"1:1"],
}

SEGMENT_QUICK_WINS = {
    "medyczny": "Rozdzielic strone na dwie sciezki: bol/kontuzja i forma, z osobnymi CTA.",
    "metamorfoza": "Dodac sekcje "
    "Pierwsze 30 dni"
    " i mocne CTA "
    "Umow trening probny"
    " nad foldem.",
    "sport_endurance": "Wstawic jasna sciezke: diagnoza -> plan -> monitoring postepu pod konkretny cel.",
    "dietetyka": "Dodac formularz celu (waga, nawyki, termin) i automatyczny follow-up po zapisie.",
    "mobility": "W hero pokazac dla kogo + 3 pakiety i jeden prosty przycisk kontaktu.",
    "ogolny_1_1": "Uproscic oferte do 3 krokow i zostawic jeden dominujacy przycisk "
    "Umow konsultacje"
    ".",
}

SEGMENT_SECONDARY_WINS = {
    "medyczny": "Krotka ankieta dolegliwosci przed zapisem, z dopasowaniem konsultacji.",
    "metamorfoza": "Sekcja efektow przed/po z czasem wspolpracy i konkretnym wynikiem.",
    "sport_endurance": "Kalkulator doboru pakietu pod liczbe treningow i cel sezonu.",
    "dietetyka": "Lead magnet 3 bledy, ktore blokuja redukcje pod budowe listy leadow.",
    "mobility": "FAQ od czego zaczac i uproszczony formularz na telefon.",
    "ogolny_1_1": "Wyrzucic zbedne bloki i zostawic 1 obietnice + 1 CTA + 3 opinie.",
}

POLISH_CHAR_MAP = str.maketrans(
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

MANUAL_OVERRIDES = {
    "arkadiusz-czajkowski-trener-personalny": {
        "niche": "medyczny",
        "hook": "laczenie metamorfozy z treningiem prozdrowotnym (plecy) to mocny wyroznik.",
        "quick_win": "Rozdzielic CTA na "
        "Schudnij"
        " i "
        "Pozbadz sie bolu plecow"
        " z osobnymi formularzami.",
        "confidence": "high",
    },
    "bartosz-jaszczak-trener-personalny-bydgoszcz": {
        "niche": "ogolny_1_1",
        "hook": "masz czytelna oferte: funkcjonalny, kalistenika, silowy i cardio.",
        "quick_win": "Dodac quiz "
        "Wybierz typ treningu"
        " i kierowac do jednego dopasowanego CTA.",
        "confidence": "high",
    },
    "bartosz-trzebiatowski-trener-personalny": {
        "niche": "medyczny",
        "hook": "naukowe podejscie i testy sprawnosciowe dobrze buduja zaufanie.",
        "quick_win": "Dopisac sekcje dla kogo ktory program nad formularzem.",
        "confidence": "high",
    },
    "bartosz-tywusik-trener-personalny": {
        "niche": "medyczny",
        "hook": "komunikat usun przyczyny bolu mocno odcina Cie od rynku fit-only.",
        "quick_win": "Dodac ankiete bolu i automatycznie proponowac najblizszy typ konsultacji.",
        "confidence": "high",
    },
    "damian-piskorz": {
        "niche": "metamorfoza",
        "hook": "osiagniecia sportowe (kickboxing) sa u Ciebie naturalnym proofem kompetencji.",
        "quick_win": "Pokazac dwa osobne wejscia: sport/kickboxing i forma/sylwetka.",
        "confidence": "high",
    },
    "daria-petla-trener-personalny": {
        "niche": "metamorfoza",
        "hook": "dobrze, ze laczysz trening z doradztwem zywieniowym, nie sama silownia.",
        "quick_win": "W pierwszym ekranie zostawic 1 obietnice + 3 pakiety + 1 CTA.",
        "confidence": "high",
    },
    "dawid-cichanski": {
        "niche": "ogolny_1_1",
        "hook": "profil lokalny ma potencjal, ale przydalby sie prosty funnel pod konsultacje.",
        "quick_win": "Postawic prosty landing one-page z cennikiem start i formularzem.",
        "confidence": "medium",
    },
    "dietetyk-bydgoszcz-tomasz-giza": {
        "niche": "dietetyka",
        "hook": "NBP i nacisk na nawyki zyciowe to mocny, inny przekaz niz zwykle rozpiski.",
        "quick_win": "Dodac lead magnet i formularz celu z automatycznym follow-upem.",
        "confidence": "high",
    },
    "forever-athlete-vincent-marek": {
        "niche": "ogolny_1_1",
        "hook": "nazwa marki sugeruje prace nad forma dlugofalowo, a nie szybki "
        "challenge"
        ".",
        "quick_win": "Dopisac jasna oferte 3 pakietow i jeden kontaktowy CTA.",
        "confidence": "low",
    },
    "jagoda-konczal-trener-personalny": {
        "niche": "ogolny_1_1",
        "hook": "na stronie brakuje tresci, wiec lepiej oprzec demo o prosty model 1:1.",
        "quick_win": "Uzupelnic minimum: oferta, cennik, 3 opinie i formularz.",
        "confidence": "low",
    },
    "jakub-stypczynski-trener-personalny-bydgoszcz": {
        "niche": "metamorfoza",
        "hook": "Sila Konsekwencji i proces wspolpracy online sa bardzo spojnym brandingiem.",
        "quick_win": "Dodac sticky CTA "
        "Umow konsultacje 15 min"
        " i skrocic sciezke zapisu.",
        "confidence": "high",
    },
    "kaja-narkun": {
        "niche": "ogolny_1_1",
        "hook": "przy ograniczonych danych najlepiej stawiac na prosty komunikat efekt -> kontakt.",
        "quick_win": "Jednostronicowy profil z 3 efektami i przyciskiem "
        "oddzwonie dzis"
        ".",
        "confidence": "low",
    },
    "lukasz-dziennik-atletyczna-sila": {
        "niche": "sport_endurance",
        "hook": "profil trenerski i przygotowanie silowe mocno uzasadniaja pozycje ekspercka.",
        "quick_win": "Zrobic osobna strone trenerska (nie sam katalog) z case studies i CTA.",
        "confidence": "high",
    },
    "maciej-karolczyk-trener-personalny": {
        "niche": "ogolny_1_1",
        "hook": "przy braku publicznej oferty najlepiej dziala komunikat pod klienta poczatkujacego.",
        "quick_win": "Landing start od zera + formularz kwalifikacyjny.",
        "confidence": "low",
    },
    "maja-burek-trener-personalny": {
        "niche": "ogolny_1_1",
        "hook": "wizerunek w socialach wyglada dobrze, ale brakuje strony, ktora domyka lead.",
        "quick_win": "Dopisac bio-site z sekcja dla kogo pracuje i szybkim zapisem.",
        "confidence": "medium",
    },
    "mateusz-mazur": {
        "niche": "ogolny_1_1",
        "hook": "oferta online jest gotowa do zakupu, co dobrze skraca droge decyzji.",
        "quick_win": "Pokazac 3 case studies z wynikiem i czasem wspolpracy obok ofert.",
        "confidence": "high",
    },
    "mikolaj-karaszewski-fitness-lifestyle": {
        "niche": "metamorfoza",
        "hook": "nazwa "
        "fitness lifestyle"
        " dobrze wspiera przekaz o nawykach i regularnosci.",
        "quick_win": "Dopisac program 90 dni i tygodniowy check-in na stronie.",
        "confidence": "medium",
    },
    "norbert-lysiak-trener-osobisty-triathlon-mtb-plywanie": {
        "niche": "sport_endurance",
        "hook": "triatlon i MTB sa jasno komunikowane, to mocny i konkretny niche.",
        "quick_win": "Kalkulator pakietu pod cel sezonu + CTA na konsultacje 60 min.",
        "confidence": "high",
    },
    "oskar-kaliszewski-trener-personalny": {
        "niche": "ogolny_1_1",
        "hook": "tutaj najlepiej zagra prosty przekaz: redukcja, sila, regularnosc.",
        "quick_win": "Mini-landing z 3 sciezkami celu i formularzem kwalifikacyjnym.",
        "confidence": "low",
    },
    "patryk-kozikowski": {
        "niche": "ogolny_1_1",
        "hook": "bez mocnego contentu www personalizacja powinna isc przez cel klienta.",
        "quick_win": "One-page + kalendarz konsultacji i FAQ dla poczatkujacych.",
        "confidence": "low",
    },
    "patryk-michalek-trener-personalny": {
        "niche": "ogolny_1_1",
        "hook": "mocny kierunek na poczatkujacych i prowadzenie krok po kroku.",
        "quick_win": "Dodac sekcje pierwsze 30 dni bezposrednio pod hero.",
        "confidence": "high",
    },
    "trener-personalny-bydgoszcz-nicolas-marysiak": {
        "niche": "ogolny_1_1",
        "hook": "opinie i ocena 5.0 sa gotowym social proof, trzeba to lepiej domknac CTA.",
        "quick_win": "Formularz z 3 pytaniami (cel, termin, budzet) dla lepszej kwalifikacji.",
        "confidence": "high",
    },
    "trener-personalny-kamil-makowski": {
        "niche": "medyczny",
        "hook": "dobrze laczysz trening online z obszarem bolu i powrotu po kontuzji.",
        "quick_win": "Pokazac osobne case studies dla bol/kontuzja i sylwetka.",
        "confidence": "high",
    },
    "trener-personalny-szymon-idzinski": {
        "niche": "ogolny_1_1",
        "hook": "przy danych glownie z sociala lepiej wejsc prosto i konkretnie.",
        "quick_win": "Prosty landing z oferta 1:1 i sekcja "
        "jak wyglada pierwszy trening"
        ".",
        "confidence": "medium",
    },
    "trener-radoslaw-habera": {
        "niche": "medyczny",
        "hook": "pozycjonowanie pod bol i trening medyczny jest bardzo czytelne.",
        "quick_win": "Podpiac CTA pod wpisy blogowe (np. staw skokowy -> konsultacja).",
        "confidence": "high",
    },
    "wiktoria-wasik": {
        "niche": "metamorfoza",
        "hook": "laczysz trening, online i plany zywieniowe, czyli naturalna drabine ofert.",
        "quick_win": "W pierwszym ekranie pokazac 3 kafle ofert i jedno mocne CTA.",
        "confidence": "high",
    },
}


def normalize(value: str | None) -> str:
    if not value:
        return ""
    return " ".join(value.replace("\xa0", " ").strip().split())


def to_ascii(value: str) -> str:
    mapped = value.translate(POLISH_CHAR_MAP)
    normalized = unicodedata.normalize("NFKD", mapped)
    return "".join(ch for ch in normalized if ord(ch) < 128)


def slug_variant(slug: str, modulo: int) -> int:
    digest = hashlib.md5(slug.encode("utf-8")).hexdigest()
    return int(digest[:8], 16) % modulo


def first_name(title: str, slug: str) -> str:
    source = to_ascii(normalize(title)) or to_ascii(slug.replace("-", " "))
    words = re.findall(r"[A-Za-z]+", source)
    stop = {
        "Trener",
        "Personalny",
        "Personalna",
        "Trenerka",
        "Bydgoszcz",
        "Dietetyk",
        "Fitness",
        "Lifestyle",
    }
    for word in words:
        if word and word not in stop:
            return word
    return words[0] if words else ""


def domain(url: str) -> str:
    try:
        host = urlparse(url).netloc.lower().strip()
        return host.replace("www.", "")
    except Exception:
        return ""


def is_social(url: str) -> bool:
    host = domain(url)
    if not host:
        return False
    return any(s in host for s in SOCIAL_HOSTS)


def strip_tags(raw: str) -> str:
    text = re.sub(r"<script[\s\S]*?</script>", " ", raw, flags=re.I)
    text = re.sub(r"<style[\s\S]*?</style>", " ", text, flags=re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    return normalize(html.unescape(text))


def fetch_page(url: str, cache: dict[str, dict[str, str]]) -> dict[str, str]:
    if not url:
        return {"title": "", "h1": "", "desc": "", "text": "", "source": "missing"}

    if url in cache:
        return cache[url]

    try:
        req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urlopen(req, timeout=10) as resp:
            raw = resp.read(1_000_000).decode("utf-8", errors="ignore")
    except Exception:
        source_type = "social" if is_social(url) else "website"
        result = {"title": "", "h1": "", "desc": "", "text": "", "source": source_type}
        cache[url] = result
        return result

    title = ""
    h1 = ""
    desc = ""

    m = re.search(r"<title[^>]*>(.*?)</title>", raw, re.I | re.S)
    if m:
        title = normalize(html.unescape(re.sub(r"<[^>]+>", " ", m.group(1))))

    m = re.search(r"<h1[^>]*>(.*?)</h1>", raw, re.I | re.S)
    if m:
        h1 = normalize(html.unescape(re.sub(r"<[^>]+>", " ", m.group(1))))

    m = re.search(
        r"<meta[^>]+name=[\"']description[\"'][^>]+content=[\"'](.*?)[\"']",
        raw,
        re.I | re.S,
    )
    if m:
        desc = normalize(html.unescape(m.group(1)))

    source_type = "social" if is_social(url) else "website"
    result = {
        "title": title[:140],
        "h1": h1[:140],
        "desc": desc[:220],
        "text": strip_tags(raw)[:3500],
        "source": source_type,
    }
    cache[url] = result
    return result


def looks_generic_cue(value: str) -> bool:
    if not value:
        return True
    cue = to_ascii(value.lower())
    generic_exact = {
        "home",
        "start",
        "bydgoszcz",
        "strona glowna",
        "trener personalny",
        "trenerka personalna",
        "oferty",
        "kontakt",
    }
    if cue in generic_exact:
        return True
    if len(cue) < 14:
        return True
    return False


def infer_niche(slug: str, text: str) -> str:
    override = MANUAL_OVERRIDES.get(slug, {})
    if override.get("niche"):
        return str(override["niche"])

    sample = to_ascii(text.lower())
    scores: dict[str, int] = {}
    for niche, patterns in SEGMENT_PATTERNS.items():
        score = 0
        for pattern in patterns:
            score += len(re.findall(pattern, sample))
        scores[niche] = score

    winner = max(scores.items(), key=lambda item: item[1])
    if winner[1] <= 0:
        return "ogolny_1_1"
    return winner[0]


def choose_cue(
    slug: str, meta: dict[str, str], fallback_title: str, fallback_url: str
) -> str:
    override = MANUAL_OVERRIDES.get(slug, {})
    hook = normalize(str(override.get("hook", "")))
    if hook:
        return hook

    for candidate in [meta.get("h1", ""), meta.get("title", ""), meta.get("desc", "")]:
        item = normalize(candidate)
        if item and not looks_generic_cue(item):
            return item

    title = normalize(fallback_title)
    if title and not looks_generic_cue(title):
        return title

    host = domain(fallback_url)
    return f"profil lokalny ({host})" if host else "profil trenerski"


def quick_win_for(slug: str, niche: str) -> str:
    override = MANUAL_OVERRIDES.get(slug, {})
    custom = normalize(str(override.get("quick_win", "")))
    if custom:
        return custom
    return SEGMENT_QUICK_WINS.get(niche, SEGMENT_QUICK_WINS["ogolny_1_1"])


def secondary_win_for(niche: str) -> str:
    return SEGMENT_SECONDARY_WINS.get(niche, SEGMENT_SECONDARY_WINS["ogolny_1_1"])


def confidence_for(slug: str, source: str, cue: str, niche: str) -> str:
    override = MANUAL_OVERRIDES.get(slug, {})
    if override.get("confidence"):
        return str(override["confidence"])

    if source == "website" and cue and niche != "ogolny_1_1":
        return "high"
    if source == "website" and cue:
        return "medium"
    if source == "social":
        return "low"
    return "low"


def tone_recommendation(niche: str, confidence: str) -> str:
    if confidence == "low":
        return "friendly"
    if niche in {"medyczny", "dietetyka"}:
        return "premium"
    if niche in {"sport_endurance", "metamorfoza"}:
        return "direct"
    return "friendly"


def build_subjects(name: str, niche_label: str, slug: str) -> tuple[str, str]:
    who = name if name else "Hej"
    base = [
        f"{who}, szybkie demo strony pod Twoja marke",
        f"{who}, mam 3 szybkie poprawki pod wiecej zapytan",
        f"{who}, demo pod {niche_label}",
    ]
    alt = [
        f"{who}, czy moge wyslac mini-audyt strony?",
        f"{who}, krotka propozycja pod Twoj funnel",
        f"{who}, 2 minuty i zobaczysz roznice",
    ]
    idx = slug_variant(slug, len(base))
    return base[idx][:96], alt[idx][:96]


def build_email_variants(
    slug: str,
    name: str,
    cue: str,
    niche_label: str,
    demo_url: str,
    quick_win: str,
    second_win: str,
) -> dict[str, str]:
    who = name or ""
    hello = f"Czesc {who}," if who else "Czesc,"
    cue_line = f"Wpadlo mi w oko, ze {cue}."

    friendly = (
        f"{hello}\n\n"
        f"{cue_line}\n"
        f"Przygotowalem krotkie demo strony pod Twoja marke:\n{demo_url}\n\n"
        "Nie wysylam oferty w ciemno."
        f" Najpierw moge podeslac 3 konkretne poprawki pod wiecej zapytan.\n"
        f"Pierwsza z nich: {quick_win}\n\n"
        "Jesli chcesz, odpisz "
        "tak"
        " i wysle caly mini-audyt."
    )

    premium = (
        f"{hello}\n\n"
        f"Sprawdzilem Twoja obecna komunikacje i najbardziej wybrzmiewa: {cue}.\n"
        f"Z tej perspektywy przygotowalem demo: {demo_url}\n\n"
        "Zamiast od razu proponowac pakiet, moge najpierw wyslac 3 precyzyjne zmiany"
        f" pod wzrost zapytan ({niche_label}).\n"
        f"Najmocniejsza: {quick_win}\n\n"
        "Moge je wyslac w jednej wiadomosci?"
    )

    direct = (
        f"{hello}\n\n"
        f"Zrobilem demo pod Twoja marke: {demo_url}\n"
        f"Szybki konkret: {quick_win}\n"
        f"Dodatkowo dorzucilbym: {second_win}\n\n"
        "Chcesz, zebym wyslal 3 punkty dzisiaj?"
    )

    fu_1 = (
        f"Czesc {who}, wracam z jedna konkretna rzecza pod Twoja strone:\n"
        f"{quick_win}\n\n"
        "Jesli chcesz, podesle wersje przed/po na Twoim demie."
    ).strip()

    fu_2 = (
        f"Hej {who}, moge tez dorzucic drugi szybki ruch:\n"
        f"{second_win}\n\n"
        "To dalej bez oferty i bez zobowiazan. Wyslac?"
    ).strip()

    fu_3 = (
        f"Domykam temat, {who}.\n"
        "Nie chce spamowac. Jesli kiedys bedziesz chcial odswiezyc strone pod wiecej zapytan,"
        " napisz "
        "demo"
        " i wrzuce aktualna wersje."
    ).strip()

    dm_1 = (
        f"Czesc {who}! Zrobilem krotkie demo strony pod Twoja marke: {demo_url}. "
        f"Jesli chcesz, podesle 3 konkretne poprawki (pierwsza: {quick_win})."
    ).strip()

    dm_fu = (
        f"Hej {who}, przypominam o demie. "
        "Jesli chcesz, wysle 1-min podsumowanie zmian pod wiecej zapytan."
    ).strip()

    return {
        "email_1_friendly": friendly,
        "email_1_premium": premium,
        "email_1_direct": direct,
        "followup_1": fu_1,
        "followup_2": fu_2,
        "followup_3": fu_3,
        "dm_1": dm_1,
        "dm_followup": dm_fu,
    }


def main() -> None:
    contacts = list(
        csv.DictReader(CONTACTS_CSV.open("r", encoding="utf-8", newline=""))
    )
    reviews = list(csv.DictReader(REVIEW_CSV.open("r", encoding="utf-8", newline="")))
    review_by_slug = {normalize(row.get("slug")): row for row in reviews}

    page_cache: dict[str, dict[str, str]] = {}
    rows_out: list[dict[str, str]] = []

    for row in contacts:
        slug = normalize(row.get("slug"))
        title = to_ascii(normalize(row.get("title")))
        email = normalize(row.get("email"))
        email_status = normalize(row.get("email_status"))
        phone = normalize(row.get("phone"))
        website = normalize(row.get("website"))
        facebook = normalize(row.get("facebook"))
        instagram = normalize(row.get("instagram"))

        review = review_by_slug.get(slug, {})
        vercel_url = normalize(review.get("vercel_url"))
        project_url = website or vercel_url

        meta = fetch_page(website or vercel_url, page_cache)
        source_type = meta.get("source", "missing")
        first = to_ascii(first_name(title, slug))

        analysis_text = " ".join(
            [
                slug,
                title,
                website,
                facebook,
                instagram,
                meta.get("title", ""),
                meta.get("h1", ""),
                meta.get("desc", ""),
                meta.get("text", ""),
            ]
        )

        niche_key = infer_niche(slug, analysis_text)
        niche_label = SEGMENT_LABELS.get(niche_key, SEGMENT_LABELS["ogolny_1_1"])

        cue = to_ascii(choose_cue(slug, meta, title, website or vercel_url))
        quick_win = to_ascii(quick_win_for(slug, niche_key))
        second_win = to_ascii(secondary_win_for(niche_key))

        confidence = confidence_for(slug, source_type, cue, niche_key)
        tone = tone_recommendation(niche_key, confidence)

        subject_1, subject_alt_1 = build_subjects(first, niche_label, slug)
        message_bundle = build_email_variants(
            slug=slug,
            name=first,
            cue=cue,
            niche_label=niche_label,
            demo_url=vercel_url or "[wstaw_link_demo]",
            quick_win=quick_win,
            second_win=second_win,
        )

        email_1 = message_bundle.get(
            f"email_1_{tone}", message_bundle["email_1_friendly"]
        )
        notes = f"Cue: {cue} | Source: {source_type} | Niche: {niche_label}"

        phone_opening = (
            f"Dzien dobry, tu [Twoje Imie]. Czy rozmawiam z {title}? "
            f"Przygotowalem krotkie demo strony ({vercel_url or '[link]'}). "
            "Czy moge wyslac je SMS-em lub mailem?"
        )

        cta = "CTA: najpierw demo + mini-audyt, oferta dopiero po pozytywnej reakcji"

        rows_out.append(
            {
                "slug": slug,
                "title": title,
                "first_name": first,
                "email": email,
                "email_status": email_status,
                "channel": "email" if email else "dm_or_phone",
                "phone": phone,
                "website": website,
                "vercel_url": vercel_url,
                "project_url": project_url,
                "source_type": source_type,
                "confidence": confidence,
                "niche": niche_label,
                "opener_line": cue,
                "quick_win": quick_win,
                "tone_recommendation": tone,
                "research_notes": notes,
                "subject_1": subject_1,
                "subject_alt_1": subject_alt_1,
                "email_1": email_1,
                "email_1_friendly": message_bundle["email_1_friendly"],
                "email_1_premium": message_bundle["email_1_premium"],
                "email_1_direct": message_bundle["email_1_direct"],
                "followup_1": message_bundle["followup_1"],
                "followup_2": message_bundle["followup_2"],
                "followup_3": message_bundle["followup_3"],
                "dm_1": message_bundle["dm_1"],
                "dm_followup": message_bundle["dm_followup"],
                "phone_opening": phone_opening,
                "cta": cta,
                "playbook_version": "v2_research_driven_2026-02-21",
            }
        )

    fields = [
        "slug",
        "title",
        "first_name",
        "email",
        "email_status",
        "channel",
        "phone",
        "website",
        "vercel_url",
        "project_url",
        "source_type",
        "confidence",
        "niche",
        "opener_line",
        "quick_win",
        "tone_recommendation",
        "research_notes",
        "subject_1",
        "subject_alt_1",
        "email_1",
        "email_1_friendly",
        "email_1_premium",
        "email_1_direct",
        "followup_1",
        "followup_2",
        "followup_3",
        "dm_1",
        "dm_followup",
        "phone_opening",
        "cta",
        "playbook_version",
    ]

    with OUT_CSV.open("w", encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows_out)

    unique_subjects = len(
        {normalize(row["subject_1"]) for row in rows_out if normalize(row["subject_1"])}
    )
    email_rows = [row for row in rows_out if normalize(row["email"])]
    print(f"generated={OUT_CSV}")
    print(f"rows={len(rows_out)}")
    print(f"email_rows={len(email_rows)}")
    print(f"unique_subjects={unique_subjects}")


if __name__ == "__main__":
    main()
