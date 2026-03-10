from __future__ import annotations

import csv
import hashlib
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PREFERRED_CSV = ROOT.parent / "trenerzy_bydgoszcz_personalni.csv"
FALLBACK_CSV = ROOT.parent / "trenerzy_bydgoszcz_final_merged.csv"
CSV_PATH = PREFERRED_CSV if PREFERRED_CSV.exists() else FALLBACK_CSV
CLIENTS_DIR = ROOT / "klienci"
DATA_DIR = ROOT / "data"


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


def read_rows():
    for encoding in ("utf-8-sig", "cp1250", "latin-1"):
        try:
            with CSV_PATH.open("r", encoding=encoding, newline="") as f:
                return list(csv.DictReader(f))
        except UnicodeDecodeError:
            continue
    raise RuntimeError("Cannot decode CSV")


def normalize(value: str) -> str:
    if not value:
        return ""
    value = value.replace("\xa0", " ").strip()
    value = re.sub(r"\s+", " ", value)
    return value


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
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    if not text:
        text = "trener"
    base = text
    i = 2
    while text in used:
        text = f"{base}-{i}"
        i += 1
    used.add(text)
    return text


def esc(value: str) -> str:
    return value.replace("\\", "\\\\").replace("'", "\\'")


def maybe_url(value: str) -> str:
    value = normalize(value)
    if not value:
        return ""
    if not re.match(r"^https?://", value, flags=re.I):
        value = "https://" + value
    return value


def maybe_email(value: str) -> str:
    value = normalize(value)
    if ";" in value:
        value = value.split(";")[0].strip()
    return value


def pick_palette(slug: str):
    idx = int(hashlib.md5(slug.encode("utf-8")).hexdigest(), 16) % len(PALETTES)
    return PALETTES[idx]


def category_copy(category: str) -> tuple[str, str, str]:
    cat = category.lower()
    if "kobiet" in cat:
        return (
            "BUDUJ FORME",
            "Z PLANEM DOPASOWANYM DO CIEBIE.",
            "Program treningowy i nawyki dopasowane do codziennego rytmu dnia, celu sylwetkowego i poziomu zaawansowania.",
        )
    if "fizjo" in cat or "rehabil" in cat:
        return (
            "TRENUJ",
            "BEZPIECZNIE I SWIADOMIE.",
            "Wspolpraca oparta o poprawna technike, stopniowy progres i dbanie o zdrowie ruchowe na kazdym etapie.",
        )
    if "pilates" in cat or "joga" in cat:
        return (
            "WZMOCNIJ CIALO",
            "I POPRAW JAKOSC RUCHU.",
            "Trening ukierunkowany na sile funkcjonalna, mobilnosc i lepsze samopoczucie na co dzien.",
        )
    if "crossfit" in cat or "sztuk" in cat or "boks" in cat:
        return (
            "ZBUDUJ",
            "SILE, WYTRZYMALOSC I FORME.",
            "Skuteczne jednostki treningowe, konkretne cele i regularna kontrola postepu w praktyce.",
        )
    return (
        "TRENUJ",
        "MADRZE I SKUTECZNIE.",
        "Indywidualne prowadzenie treningowe w Bydgoszczy i online. Jasny plan, regularna kontrola progresu i wsparcie na kazdym etapie.",
    )


def derive_names(title: str) -> tuple[str, str]:
    normalized = title.strip()
    normalized = re.sub(r"^[^A-Za-z0-9]+", "", normalized)

    # Remove common trainer prefixes first
    normalized = re.sub(
        r"(?i)^(trener personalny bydgoszcz|trener personalny|trenerka|trener biegania bydgoszcz|trener biegania)\s*[-|:]?\s*",
        "",
        normalized,
    )

    stop_words = {
        "trener",
        "personalny",
        "osobisty",
        "bydgoszcz",
        "studio",
        "treningu",
        "trening",
        "dla",
        "kobiet",
        "fizjoterapia",
        "rehabilitacja",
        "medyczny",
        "gym",
        "fit",
        "sport",
        "sports",
        "bioneuro",
        "klinika",
    }

    person_word = re.compile(r"^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+$")

    # Split title by common separators and try to extract first + last name
    segments = [s.strip() for s in re.split(r"[|\-–—]", normalized) if s.strip()]
    for segment in segments + [normalized]:
        words = re.findall(r"[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]+", segment)
        words = [w for w in words if w.lower() not in stop_words]
        if len(words) >= 2:
            first, last = words[0], words[1]
            if (
                len(first) >= 2
                and len(last) >= 2
                and person_word.match(first)
                and person_word.match(last)
            ):
                person = f"{first} {last}"
                return person, person

    # Last resort fallback
    fallback = normalized.strip() or title.strip()
    return fallback, fallback


def build_profile(row: dict, slug: str) -> str:
    title = normalize(row.get("Title") or row.get("\ufeffTitle") or "Trener personalny")
    category = normalize(row.get("Category") or "Trener personalny")
    address = normalize(row.get("Address") or "Bydgoszcz")
    phone = normalize(row.get("Phone") or "")
    email = maybe_email(row.get("Email") or "")
    website = maybe_url(row.get("Website") or "")
    instagram = maybe_url(row.get("Instagram") or "")
    facebook = maybe_url(row.get("Facebook") or "")
    rating_raw = normalize(row.get("Rating") or "")
    try:
        rating = float(rating_raw.replace(",", ".")) if rating_raw else 5.0
    except ValueError:
        rating = 5.0

    hero_top, hero_accent, hero_text = category_copy(category)
    palette = pick_palette(slug)

    brand_name, nav_name = derive_names(title)
    about_heading = f"{brand_name} - profesjonalne prowadzenie treningowe w Bydgoszczy."
    about_text = "Wspolpraca opiera sie na czytelnym planie, regularnych korektach i dopasowaniu treningu do celu oraz stylu zycia."

    return f"""import type {{ TrainerProfile }} from '../../data/trainerProfile';

const profile: TrainerProfile = {{
  slug: '{esc(slug)}',
  fullName: '{esc(brand_name)}',
  brandName: '{esc(brand_name)}',
  navName: '{esc(nav_name)}',
  brandTagline: '{esc(category)}',
  city: 'Bydgoszcz',
  address: '{esc(address)}',
  category: '{esc(category)}',
  phone: '{esc(phone)}',
  email: '{esc(email)}',
  website: '{esc(website)}',
  instagram: '{esc(instagram)}',
  facebook: '{esc(facebook)}',
  rating: {rating:.1f},
  heroTitleTop: '{esc(hero_top)}',
  heroTitleAccent: '{esc(hero_accent)}',
  heroText: '{esc(hero_text)}',
  aboutHeading: '{esc(about_heading)}',
  aboutText: '{esc(about_text)}',
  theme: {{
    accent: '{palette["accent"]}',
    accentDark: '{palette["accentDark"]}',
    accentSoft: '{palette["accentSoft"]}',
    bg: '{palette["bg"]}',
    bgSoft: '{palette["bgSoft"]}',
    surface: '{palette["surface"]}',
    surfaceAlt: '{palette["surfaceAlt"]}',
    border: '{palette["border"]}',
    textMuted: '{palette["textMuted"]}',
  }},
}};

export default profile;
"""


def build_registry(slugs: list[str]) -> str:
    imports = []
    entries = []
    for slug in slugs:
        var_name = re.sub(r"[^a-zA-Z0-9]", "_", slug)
        imports.append(f"import {var_name} from '../klienci/{slug}/profile';")
        entries.append(f"  '{slug}': {var_name},")

    imports_text = "\n".join(imports)
    entries_text = "\n".join(entries)

    default_slug = ""

    return f"""import type {{ TrainerProfile }} from './trainerProfile';
{imports_text}

export const trainerProfiles: Record<string, TrainerProfile> = {{
{entries_text}
}};

export const defaultTrainerSlug = '{default_slug}';
"""


def main() -> None:
    rows = read_rows()
    used: set[str] = set()
    slugs: list[str] = []

    CLIENTS_DIR.mkdir(parents=True, exist_ok=True)

    for row in rows:
        title = normalize(
            row.get("Title") or row.get("\ufeffTitle") or "Trener personalny"
        )
        slug = slugify(title, used)
        slugs.append(slug)
        trainer_dir = CLIENTS_DIR / slug
        trainer_dir.mkdir(parents=True, exist_ok=True)
        profile_content = build_profile(row, slug)
        (trainer_dir / "profile.ts").write_text(profile_content, encoding="utf-8")

    registry = build_registry(slugs)
    (DATA_DIR / "trainerProfiles.ts").write_text(registry, encoding="utf-8")

    print(f"generated_profiles={len(slugs)}")
    print(f"default_slug={slugs[0] if slugs else ''}")


if __name__ == "__main__":
    main()
