from __future__ import annotations

import csv
import json
import re
from copy import deepcopy
from pathlib import Path
from typing import Any, Dict, Iterable, List


ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = ROOT.parent

GENERATED_JSON = ROOT / "src" / "data" / "biura" / "biuroResearch.generated.json"
MANUAL_TS = ROOT / "src" / "data" / "biura" / "biuroProfiles.manual.ts"
READY_CSV = REPO_ROOT / "Strona-trenerzy" / "data" / "poznan_biura_ready_pages_2026.csv"

EXCLUDED_SLUGS = {
    "am-kancelaria-rachunkowa-sp-z-o-o",
}

LEGAL_PATTERNS = [
    r"\bsp\.?\s*z\.?\s*o\.?\s*o\.?\b",
    r"\bspolka\s+z\s+ograniczona\s+odpowiedzialnoscia\b",
    r"\bsp[oó]lka\s+z\s+ograniczona\s+odpowiedzialnoscia\b",
    r"\bs\.?\s*a\.?\b",
    r"\bsp\.?\s*k\.?\b",
]

NON_PERSON_IMAGE_TOKENS = [
    "real-estate",
    "building",
    "biurow",
    "office",
    "nieruchom",
    "wnetrz",
    "interior",
    "logo",
    "icon",
    "banner",
    "stock",
    "dummy",
    "tax-office",
]

DEFAULT_TEAM_IMAGES = [
    "/images/team-marta.jpg",
    "/images/team-anna.jpg",
    "/images/team-tomasz.jpg",
    "/images/team-piotr.jpg",
]

DEFAULT_TEAM_POSITIONS = [
    "center 16%",
    "center 18%",
    "center 14%",
    "center 12%",
]


def clean(value: Any) -> str:
    return " ".join(str(value or "").strip().split())


def strip_legal_suffix(value: str) -> str:
    text = clean(value)
    if not text:
        return ""

    for pattern in LEGAL_PATTERNS:
        text = re.sub(pattern, "", text, flags=re.IGNORECASE)

    text = re.sub(r"\(\s*\)", "", text)
    text = re.sub(r"\s{2,}", " ", text).strip(" ,.-")
    return text


def parse_manual_overrides() -> Dict[str, Dict[str, Any]]:
    raw = MANUAL_TS.read_text(encoding="utf-8")
    payload = raw.split("=", 1)[1].rsplit(";", 1)[0].strip()
    return json.loads(payload)


def write_manual_overrides(overrides: Dict[str, Dict[str, Any]]) -> None:
    content = (
        "import type { BiuroProfileOverride } from './biuroProfile';\n\n"
        "export const biuroProfilesManualOverrides: Record<string, BiuroProfileOverride> = "
        + json.dumps(overrides, ensure_ascii=False, indent=2)
        + ";\n"
    )
    MANUAL_TS.write_text(content, encoding="utf-8")


def merge(base: Dict[str, Any], override: Dict[str, Any]) -> Dict[str, Any]:
    out = deepcopy(base)
    for key, value in (override or {}).items():
        if isinstance(value, dict) and isinstance(out.get(key), dict):
            out[key] = merge(out[key], value)
        else:
            out[key] = deepcopy(value)
    return out


def set_nested(target: Dict[str, Any], path: str, value: Any) -> None:
    keys = path.split(".")
    cursor = target
    for key in keys[:-1]:
        node = cursor.get(key)
        if not isinstance(node, dict):
            node = {}
            cursor[key] = node
        cursor = node
    cursor[keys[-1]] = value


def is_person_image(url: str) -> bool:
    lowered = clean(url).lower()
    if not lowered:
        return False
    if lowered.endswith(".svg"):
        return False
    return not any(token in lowered for token in NON_PERSON_IMAGE_TOKENS)


def pick_first(candidates: Iterable[str], predicate) -> str:
    for candidate in candidates:
        if predicate(candidate):
            return candidate
    return ""


def choose_hero_image(profile: Dict[str, Any], team: List[Dict[str, Any]]) -> str:
    hero = profile.get("hero") or {}
    media = profile.get("media") or {}

    candidates = [
        clean(hero.get("image", "")),
        clean(media.get("heroCandidateUrl", "")),
        clean(media.get("teamCandidateUrl", "")),
    ]
    candidates.extend(clean(member.get("image", "")) for member in team)
    candidates.append("/images/hero-accountant.jpg")

    picked = pick_first(candidates, is_person_image)
    return picked or "/images/hero-accountant.jpg"


def normalize_team(profile: Dict[str, Any], display_name: str) -> List[Dict[str, Any]]:
    raw_team = profile.get("team")
    if not isinstance(raw_team, list) or not raw_team:
        return []

    media = profile.get("media") or {}
    media_team = clean(media.get("teamCandidateUrl", ""))
    media_hero = clean(media.get("heroCandidateUrl", ""))
    used: set[str] = set()

    normalized: List[Dict[str, Any]] = []
    for idx, raw_member in enumerate(raw_team):
        if not isinstance(raw_member, dict):
            continue

        member = deepcopy(raw_member)
        role = clean(member.get("role", ""))
        if role:
            role = strip_legal_suffix(role)
            role = role.replace("  ", " ").strip()
        if role.startswith("Zespół") and display_name:
            role = f"Zespół {display_name}"
        member["role"] = role

        image_candidates = [
            clean(member.get("image", "")),
            media_team if idx == 0 else "",
            media_hero if idx == 0 else "",
            DEFAULT_TEAM_IMAGES[idx % len(DEFAULT_TEAM_IMAGES)],
            DEFAULT_TEAM_IMAGES[(idx + 1) % len(DEFAULT_TEAM_IMAGES)],
        ]

        chosen = ""
        for candidate in image_candidates:
            if not candidate:
                continue
            if not is_person_image(candidate):
                continue
            if candidate in used:
                continue
            chosen = candidate
            break

        if not chosen:
            for candidate in DEFAULT_TEAM_IMAGES:
                if candidate not in used:
                    chosen = candidate
                    break
        if not chosen:
            chosen = DEFAULT_TEAM_IMAGES[idx % len(DEFAULT_TEAM_IMAGES)]

        used.add(chosen)
        member["image"] = chosen
        member["objectPosition"] = (
            clean(member.get("objectPosition", ""))
            or DEFAULT_TEAM_POSITIONS[idx % len(DEFAULT_TEAM_POSITIONS)]
        )
        normalized.append(member)

    return normalized


def load_ready_slugs() -> List[str]:
    rows = list(csv.DictReader(READY_CSV.open("r", encoding="utf-8", newline="")))
    return [row["slug"] for row in rows if row.get("status") == "ready"]


def main() -> None:
    ready_slugs = [slug for slug in load_ready_slugs() if slug not in EXCLUDED_SLUGS]
    generated_profiles = json.loads(GENERATED_JSON.read_text(encoding="utf-8"))
    generated_by_slug = {profile["slug"]: profile for profile in generated_profiles}

    overrides = parse_manual_overrides()

    updated = 0
    for slug in ready_slugs:
        base = generated_by_slug.get(slug)
        if not base:
            continue

        existing_override = overrides.get(slug, {})
        merged = merge(base, existing_override)

        display_name = strip_legal_suffix(clean(merged.get("displayName", "")))
        nav_name = strip_legal_suffix(clean(merged.get("navName", "")))
        hero_title = strip_legal_suffix(
            clean((merged.get("hero") or {}).get("titleTop", ""))
        )

        normalized_team = normalize_team(merged, display_name)
        hero_image = choose_hero_image(merged, normalized_team)

        patch = deepcopy(existing_override)

        if display_name and display_name != clean(merged.get("displayName", "")):
            set_nested(patch, "displayName", display_name)

        if nav_name and nav_name != clean(merged.get("navName", "")):
            set_nested(patch, "navName", nav_name)

        if hero_title and hero_title != clean(
            (merged.get("hero") or {}).get("titleTop", "")
        ):
            set_nested(patch, "hero.titleTop", hero_title)

        if hero_image and hero_image != clean(
            (merged.get("hero") or {}).get("image", "")
        ):
            set_nested(patch, "hero.image", hero_image)
            set_nested(patch, "media.heroCandidateUrl", hero_image)

        if normalized_team:
            set_nested(patch, "team", normalized_team)
            set_nested(
                patch,
                "media.teamCandidateUrl",
                clean(normalized_team[0].get("image", "")),
            )

        overrides[slug] = patch
        updated += 1

    write_manual_overrides(overrides)
    print(f"updated_ready_slugs={updated}")


if __name__ == "__main__":
    main()
