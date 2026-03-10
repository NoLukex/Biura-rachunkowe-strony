from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path


ROOT = Path(
    r"C:\Users\Krysiek\.gemini\antigravity\scratch\Biura rachunkowe\strona-demo"
)
MANUAL_TS = ROOT / "src" / "data" / "biura" / "biuroProfiles.manual.ts"

PREFIX = "import type { BiuroProfileOverride } from './biuroProfile';\n\nexport const biuroProfilesManualOverrides: Record<string, BiuroProfileOverride> = "

FULL_PATTERN = (
    "Nasz zespół prowadzi pełną księgowość, kadry i podatki dla firm, które oczekują sprawnej komunikacji, "
    "uporządkowanego obiegu dokumentów i wsparcia dopasowanego do realnych potrzeb biznesu. Dopasowujemy zakres współpracy."
)
KPIR_PATTERN = (
    "Nasz zespół prowadzi KPiR, kadry i bieżące rozliczenia dla firm, które oczekują sprawnej komunikacji, "
    "uporządkowanego obiegu dokumentów i wsparcia dopasowanego do realnych potrzeb biznesu. Dopasowujemy zakres współpracy."
)
KSEF_PATTERN = (
    "Nasz zespół prowadzi księgowość, podatki i procesy KSeF dla firm, które oczekują sprawnej komunikacji, "
    "uporządkowanego obiegu dokumentów i wsparcia dopasowanego do realnych potrzeb biznesu. Porządkujemy także obieg."
)


def load_profiles() -> dict:
    raw = MANUAL_TS.read_text(encoding="utf-8")
    raw = re.sub(
        r"^import type \{ BiuroProfileOverride \} from './biuroProfile';\n\nexport const biuroProfilesManualOverrides: Record<string, BiuroProfileOverride> = ",
        "",
        raw,
    )
    raw = raw.rsplit(";", 1)[0]
    return json.loads(raw)


def save_profiles(profiles: dict) -> None:
    output = PREFIX + json.dumps(profiles, ensure_ascii=False, indent=2) + ";\n"
    MANUAL_TS.write_text(output, encoding="utf-8")


def pick_variant(slug: str, variants: list[str]) -> str:
    digest = hashlib.md5(slug.encode("utf-8")).hexdigest()
    index = int(digest[:8], 16) % len(variants)
    return variants[index]


def build_variants(display_name: str) -> dict[str, list[str]]:
    return {
        "full": [
            f"Zespół {display_name} prowadzi pełną księgowość, kadry i podatki dla firm, które chcą mieć porządek w rozliczeniach, dobry kontakt i spokojną obsługę na co dzień.",
            f"W {display_name} wspieramy firmy w pełnej księgowości, kadrach i podatkach, dbając o terminowe rozliczenia, jasną komunikację i wygodny model współpracy.",
            f"{display_name} obsługuje firmy w pełnej księgowości, kadrach i podatkach, pomagając utrzymać porządek w dokumentach i większy spokój w codziennych rozliczeniach.",
            f"Prowadzimy pełną księgowość, kadry i podatki dla firm, które oczekują rzetelnej obsługi, sprawnych rozliczeń i stałego kontaktu z zespołem.",
        ],
        "kpir": [
            f"Zespół {display_name} prowadzi KPiR, kadry i bieżące rozliczenia dla firm, które chcą mieć porządek w dokumentach i spokojną współpracę na co dzień.",
            f"W {display_name} wspieramy firmy w KPiR, kadrach i codziennych rozliczeniach, dbając o terminowość, dobry kontakt i jasne zasady współpracy.",
            f"Prowadzimy KPiR, kadry i bieżące rozliczenia dla firm, które oczekują rzetelnej obsługi, czytelnej komunikacji i sprawnego działania bez zbędnego chaosu.",
            f"{display_name} pomaga firmom w KPiR, kadrach i rozliczeniach, zapewniając uporządkowaną obsługę i wsparcie dopasowane do skali działalności.",
        ],
        "ksef": [
            f"Zespół {display_name} wspiera firmy w księgowości, podatkach i KSeF, pomagając uporządkować dokumenty, rozliczenia i codzienny kontakt roboczy.",
            f"W {display_name} prowadzimy księgowość, podatki i procesy KSeF dla firm, które chcą mieć porządek w dokumentach, terminowe rozliczenia i jasną komunikację.",
            f"{display_name} pomaga firmom w księgowości, podatkach i KSeF, dbając o sprawny obieg dokumentów i spokojną obsługę bieżących rozliczeń.",
            f"Prowadzimy księgowość, podatki i procesy KSeF dla firm, które oczekują rzetelnej obsługi, dobrego kontaktu i uporządkowanego modelu współpracy.",
        ],
    }


def main() -> None:
    profiles = load_profiles()
    changed = 0

    for slug, profile in profiles.items():
        hero = profile.get("hero") or {}
        text = (hero.get("text") or "").strip()
        display_name = profile.get("displayName") or slug
        variants = build_variants(display_name)

        if text == FULL_PATTERN:
            hero["text"] = pick_variant(slug, variants["full"])
            changed += 1
        elif text == KPIR_PATTERN:
            hero["text"] = pick_variant(slug, variants["kpir"])
            changed += 1
        elif text == KSEF_PATTERN:
            hero["text"] = pick_variant(slug, variants["ksef"])
            changed += 1

        profile["hero"] = hero

    save_profiles(profiles)
    print(f"UPDATED {changed}")


if __name__ == "__main__":
    main()
