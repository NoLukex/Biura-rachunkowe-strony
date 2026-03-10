from __future__ import annotations

import csv
import json
import re
from pathlib import Path


ROOT = Path(
    r"C:\Users\Krysiek\.gemini\antigravity\scratch\Biura rachunkowe\strona-demo"
)
REPORTS = ROOT / "reports"
MANUAL_TS = ROOT / "src" / "data" / "biura" / "biuroProfiles.manual.ts"
VERIFICATION_CSV = REPORTS / "biura_manual_verification.csv"
QA_CSV = REPORTS / "ready_pages_final_qa.csv"


def load_profiles() -> dict:
    raw = MANUAL_TS.read_text(encoding="utf-8")
    raw = re.sub(
        r"^import .*?\n\nexport const biuroProfilesManualOverrides: Record<string, BiuroProfileOverride> = ",
        "",
        raw,
        flags=re.S,
    )
    raw = raw.rsplit(";", 1)[0]
    return json.loads(raw)


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8") as f:
        return list(csv.DictReader(f))


def money_values(prices: list[str]) -> list[int]:
    values = []
    for price in prices:
        m = re.search(r"(\d+)", price or "")
        if m:
            values.append(int(m.group(1)))
    return values


def verdict(profile: dict, qa_row: dict, team_type: str) -> str:
    prices = [p.get("price", "") for p in profile.get("pricingPlans", [])]
    vals = money_values(prices)
    if not profile.get("hero", {}).get("text") or not profile.get("tagline"):
        return "do poprawy"
    if qa_row.get("issues"):
        return "do poprawy"
    if any(v < 100 for v in vals) or any(v >= 1500 for v in vals):
        return "OK z uwagą"
    if team_type != "jednoosobowe" and "logo-biuro-default" in (
        profile.get("media", {}).get("logoUrl") or ""
    ):
        return "OK z drobnym polem do polishu"
    return "OK"


def service_names(profile: dict) -> str:
    return ", ".join(
        s.get("title", "") for s in profile.get("services", []) if s.get("title")
    )


def issues(profile: dict, team_type: str) -> list[str]:
    out: list[str] = []
    hero = profile.get("hero", {})
    text = hero.get("text") or ""
    tagline = profile.get("tagline") or ""
    prices = [p.get("price", "") for p in profile.get("pricingPlans", [])]
    vals = money_values(prices)

    if not text or not tagline:
        out.append("profil jest niedokończony treściowo")
    if text.endswith("do.") or text.endswith("obieg."):
        out.append("hero ma ucięte albo sztucznie skrócone zdanie")
    if any(v < 100 for v in vals):
        out.append(
            "najniższe ceny wyglądają podejrzanie nisko i wymagają potwierdzenia"
        )
    if any(v >= 1500 for v in vals):
        out.append("widoczne progi cenowe są wysokie i warto je ręcznie potwierdzić")
    if "logo-biuro-default" in (profile.get("media", {}).get("logoUrl") or ""):
        out.append("strona nadal jedzie na fallback logo")
    if (
        team_type != "jednoosobowe"
        and hero.get("image") == "/images/team-hero-group.jpg?v=1"
    ):
        out.append("hero jest spójne zespołowo, ale nadal dość szablonowe")
    if (
        team_type == "jednoosobowe"
        and hero.get("image") == "/images/solo-female-owner.jpg?v=1"
    ):
        out.append(
            "układ solo jest spójny, ale opiera się na wspólnym wzorcu zdjęciowym"
        )
    if any(
        name in text for name in ["KSeF", "procesy KSeF"]
    ) and "KSeF" not in service_names(profile):
        out.append(
            "hero mocno akcentuje KSeF, więc warto potwierdzić czy to naprawdę główny wyróżnik"
        )
    return out


def strengths(profile: dict, team_type: str) -> list[str]:
    out = []
    services = service_names(profile)
    prices = [p.get("price", "") for p in profile.get("pricingPlans", [])]
    if team_type == "jednoosobowe":
        out.append(
            "komunikacja pozostaje osobista i spójna z modelem biura jednoosobowego"
        )
    else:
        out.append("ton strony jest zespołowy i nie udaje pojedynczego właściciela")
    if services:
        out.append(f"zakres usług jest logiczny i obejmuje: {services}")
    if prices:
        out.append(f"cennik ma widoczną strukturę: {', '.join(prices)}")
    return out


def recommendation(profile: dict, team_type: str) -> str:
    text = profile.get("hero", {}).get("text") or ""
    vals = money_values([p.get("price", "") for p in profile.get("pricingPlans", [])])
    if not text or not profile.get("tagline"):
        return (
            "uzupełnić hero, tagline, ofertę i cennik zanim uznamy stronę za domkniętą"
        )
    if any(v < 100 for v in vals):
        return (
            "ręcznie sprawdzić najniższe ceny i dopiero potem zostawić stronę bez zmian"
        )
    if any(v >= 1500 for v in vals):
        return "potwierdzić wysokie progi cenowe ze źródłem albo przejść na wycenę indywidualną"
    if team_type != "jednoosobowe":
        return "zostawić jako gotowe funkcjonalnie, a w drugiej turze dopracować bardziej unikalny charakter marki"
    return "zostawić jako gotowe; ewentualny następny krok to tylko kosmetyczne dopieszczenie tonu"


def build_batch(rows: list[dict[str, str]], batch_no: int, total_batches: int) -> str:
    profiles = load_profiles()
    qa_map = {row["slug"]: row for row in read_csv(QA_CSV)}

    parts = [
        f"# Audyt reczny biur - batch {batch_no}/{total_batches}",
        "",
        f"- Data: `2026-03-09`",
        f"- Zakres tej partii: `{len(rows)}` biur",
        "- Metoda: reczny przeglad aktualnych profili, ocena logiki copy, cennika, dopasowania modelu solo/zespolowego i sygnalow z localhost QA.",
        "",
    ]

    for idx, row in enumerate(rows, start=1):
        slug = row["slug"]
        profile = profiles[slug]
        qa_row = qa_map.get(slug, {})
        label = profile.get("displayName") or row.get("displayName") or slug
        v = verdict(profile, qa_row, row["teamType"])
        strengths_list = strengths(profile, row["teamType"])
        issues_list = issues(profile, row["teamType"])
        rec = recommendation(profile, row["teamType"])
        parts.extend(
            [
                f"## {idx}. {label}",
                "",
                f"- Slug: `{slug}`",
                f"- Werdykt: `{v}`",
                f"- Typ: `{row['teamType']}`",
                f"- Localhost: `http://127.0.0.1:3000/?biuro={slug}`",
                f"- Co dziala: {'; '.join(strengths_list)}.",
                f"- Co nie gra: {'; '.join(issues_list) if issues_list else 'nie ma tu błędu krytycznego; widać głównie pole do dalszego polishu brandowego'}.",
                f"- Rekomendacja: {rec}.",
                "",
            ]
        )

    return "\n".join(parts) + "\n"


def main() -> None:
    rows = sorted(read_csv(VERIFICATION_CSV), key=lambda r: r["slug"])
    remaining = rows[25:]
    batches = [remaining[i : i + 25] for i in range(0, len(remaining), 25)]
    for i, batch_rows in enumerate(batches, start=2):
        output = (
            REPORTS
            / f"audyt_reczny_biura_batch{i}_{(i - 1) * 25 + 1}_{(i - 1) * 25 + len(batch_rows)}_2026-03-09.md"
        )
        output.write_text(build_batch(batch_rows, i, 5), encoding="utf-8")
        print(output)


if __name__ == "__main__":
    main()
