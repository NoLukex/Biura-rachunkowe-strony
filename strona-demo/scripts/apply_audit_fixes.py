from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(
    r"C:\Users\Krysiek\.gemini\antigravity\scratch\Biura rachunkowe\strona-demo"
)
MANUAL_TS = ROOT / "src" / "data" / "biura" / "biuroProfiles.manual.ts"


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
    output = (
        "import type { BiuroProfileOverride } from './biuroProfile';\n\n"
        "export const biuroProfilesManualOverrides: Record<string, BiuroProfileOverride> = "
        + json.dumps(profiles, ensure_ascii=False, indent=2)
        + ";\n"
    )
    MANUAL_TS.write_text(output, encoding="utf-8")


def set_team_solo(profile: dict, owner_name: str, role: str, credentials: str) -> None:
    profile["teamType"] = "jednoosobowe"
    profile["hero"] = {
        **profile.get("hero", {}),
        "image": "/images/solo-female-owner.jpg?v=1",
        "imagePositionMobile": "center 22%",
        "imagePositionDesktop": "center 20%",
    }
    profile["media"] = {
        **profile.get("media", {}),
        "heroCandidateUrl": "/images/solo-female-owner.jpg?v=1",
        "teamCandidateUrl": "/images/solo-female-owner.jpg?v=1",
        "logoUrl": profile.get("media", {}).get("logoUrl")
        or "/images/logo-biuro-default.svg",
    }
    profile["team"] = [
        {
            "name": owner_name,
            "role": role,
            "experience": "Bezpośrednia współpraca i stały kontakt z klientem",
            "credentials": credentials,
            "image": "/images/solo-female-owner.jpg?v=1",
            "objectPosition": "center 20%",
        }
    ]


def indywidualna(profile: dict) -> None:
    for plan in profile.get("pricingPlans", []):
        plan["price"] = "wycena indywidualna"


def maybe_clean_prices(profile: dict) -> None:
    for plan in profile.get("pricingPlans", []):
        price = str(plan.get("price", ""))
        digits = re.findall(r"\d+", price)
        if not digits:
            continue
        first = int(digits[0])
        if first < 100 or first > 1500 or "." in price or "," in price:
            plan["price"] = "wycena indywidualna"


def stage1_incomplete_and_broken(profiles: dict) -> None:
    # BIURO-NIX
    p = profiles["biuro-nix-us-ugi-ksiegowe-sp-z-o-o"]
    p["displayName"] = "BIURO-NIX Usługi Księgowe"
    p["navName"] = "BIURO-NIX Usługi Księgowe"
    p["tagline"] = (
        "Prowadzę biuro rachunkowe dla firm, które chcą mieć uporządkowane rozliczenia, spokojny kontakt i jasne zasady współpracy."
    )
    p["hero"] = {
        "titleTop": "BIURO-NIX Usługi Księgowe",
        "text": "Prowadzę obsługę księgową dla firm, które oczekują terminowych rozliczeń, bezpośredniego kontaktu i bezpiecznego wsparcia w codziennych sprawach podatkowych.",
        "image": "/images/solo-female-owner.jpg?v=1",
        "imagePositionMobile": "center 22%",
        "imagePositionDesktop": "center 20%",
    }
    p["valueProps"] = [
        "Bezpośredni kontakt i spokojna współpraca",
        "Księgowość i podatki prowadzone terminowo",
        "Zakres obsługi dopasowany do skali firmy",
    ]
    p["services"] = [
        {
            "title": "KPiR i ryczałt",
            "description": "Prowadzenie uproszczonej księgowości i bieżących rozliczeń podatkowych dla działalności gospodarczych.",
            "priceHint": "wycena indywidualna",
            "confidence": "high",
        },
        {
            "title": "Kadry i płace",
            "description": "Obsługa podstawowych spraw kadrowo-płacowych i rozliczeń ZUS dla firm z pracownikami.",
            "priceHint": "wycena indywidualna",
            "confidence": "medium",
        },
        {
            "title": "Bieżące wsparcie podatkowe",
            "description": "Pomoc w codziennych pytaniach księgowych i porządkowaniu dokumentów firmy.",
            "priceHint": "wycena indywidualna",
            "confidence": "medium",
        },
    ]
    p["pricingPlans"] = [
        {
            "name": "Start",
            "subtitle": "Dla JDG i małych firm",
            "price": "wycena indywidualna",
            "features": [
                "KPiR lub ryczałt",
                "Rozliczenia podatkowe i ZUS",
                "Kontakt bezpośrednio z właścicielką",
                "Zakres ustalany indywidualnie",
            ],
        },
        {
            "name": "Biznes",
            "subtitle": "Dla firm z większą liczbą dokumentów",
            "price": "wycena indywidualna",
            "features": [
                "Szersza obsługa księgowa",
                "Kadry i płace",
                "Bieżące wsparcie operacyjne",
                "Model współpracy dopasowany do firmy",
            ],
        },
        {
            "name": "Premium",
            "subtitle": "Dla bardziej złożonych rozliczeń",
            "price": "wycena indywidualna",
            "features": [
                "Obsługa niestandardowych spraw",
                "Wsparcie przy bardziej złożonych rozliczeniach",
                "Priorytetowy kontakt",
                "Zakres ustalany po analizie potrzeb",
            ],
        },
    ]
    set_team_solo(
        p,
        "BIURO-NIX Usługi Księgowe",
        "Właścicielka i opiekunka współpracy",
        "Księgowość i podatki",
    )

    # DM
    p = profiles["biuro-rachunkowe-dm-sp-z-oo"]
    p["displayName"] = "BIURO RACHUNKOWE DM"
    p["navName"] = "BIURO RACHUNKOWE DM"
    p["tagline"] = (
        "Prowadzę biuro rachunkowe dla firm, które oczekują terminowych rozliczeń, jasnych zasad współpracy i stałego kontaktu przy codziennych sprawach."
    )
    p["hero"] = {
        "titleTop": "BIURO RACHUNKOWE DM",
        "text": "Prowadzę księgowość dla przedsiębiorców, którzy chcą mieć porządek w dokumentach, spokojny kontakt i wsparcie dopasowane do skali działalności.",
        "image": "/images/solo-female-owner.jpg?v=1",
        "imagePositionMobile": "center 22%",
        "imagePositionDesktop": "center 20%",
    }
    p["valueProps"] = [
        "Bezpośredni kontakt z osobą prowadzącą biuro",
        "Terminowe rozliczenia i uporządkowane dokumenty",
        "Obsługa dopasowana do wielkości firmy",
    ]
    p["services"] = [
        {
            "title": "KPiR i ryczałt",
            "description": "Obsługa uproszczonej księgowości dla działalności gospodarczych i małych firm.",
            "priceHint": "wycena indywidualna",
            "confidence": "high",
        },
        {
            "title": "Kadry i płace",
            "description": "Pomoc przy podstawowych sprawach pracowniczych i rozliczeniach ZUS.",
            "priceHint": "wycena indywidualna",
            "confidence": "medium",
        },
        {
            "title": "Rozliczenia podatkowe",
            "description": "Bieżące rozliczenia podatków i wsparcie w codziennych obowiązkach księgowych.",
            "priceHint": "wycena indywidualna",
            "confidence": "medium",
        },
    ]
    p["pricingPlans"] = [
        {
            "name": "Start",
            "subtitle": "Dla małych działalności",
            "price": "wycena indywidualna",
            "features": [
                "KPiR lub ryczałt",
                "Podatki i ZUS",
                "Stały kontakt",
                "Zakres ustalany indywidualnie",
            ],
        },
        {
            "name": "Biznes",
            "subtitle": "Dla firm z większą liczbą dokumentów",
            "price": "wycena indywidualna",
            "features": [
                "Szersza obsługa księgowa",
                "Kadry i płace",
                "Bieżące konsultacje",
                "Proces dopasowany do firmy",
            ],
        },
        {
            "name": "Premium",
            "subtitle": "Dla bardziej złożonych rozliczeń",
            "price": "wycena indywidualna",
            "features": [
                "Indywidualny zakres prac",
                "Priorytetowy kontakt",
                "Wsparcie przy niestandardowych sprawach",
                "Wycena po analizie potrzeb",
            ],
        },
    ]
    set_team_solo(
        p,
        "BIURO RACHUNKOWE DM",
        "Właścicielka i opiekunka współpracy",
        "Księgowość i podatki",
    )

    # Biuro rozliczen zagranicznych
    p = profiles["biuro-rozliczen-zagranicznych"]
    p["displayName"] = "Biuro Rozliczeń Zagranicznych"
    p["navName"] = "Biuro Rozliczeń Zagranicznych"
    p["tagline"] = (
        "Prowadzę biuro, które pomaga klientom w rozliczeniach zagranicznych, podatkach i uporządkowaniu dokumentów związanych z pracą lub działalnością poza Polską."
    )
    p["hero"] = {
        "titleTop": "Biuro Rozliczeń Zagranicznych",
        "text": "Prowadzę obsługę dla klientów, którzy potrzebują wsparcia w rozliczeniach zagranicznych, podatkach, ZUS i codziennych formalnościach związanych z pracą lub firmą.",
        "image": "/images/solo-female-owner.jpg?v=1",
        "imagePositionMobile": "center 22%",
        "imagePositionDesktop": "center 20%",
    }
    p["valueProps"] = [
        "Specjalizacja w rozliczeniach zagranicznych",
        "Bezpośredni kontakt i spokojna współpraca",
        "Pomoc w dokumentach i bieżących formalnościach",
    ]
    p["services"] = [
        {
            "title": "Rozliczenia zagraniczne",
            "description": "Pomoc w rozliczeniach osób pracujących za granicą i klientów z dochodami międzynarodowymi.",
            "priceHint": "wycena indywidualna",
            "confidence": "high",
        },
        {
            "title": "Podatki i ZUS",
            "description": "Bieżące wsparcie przy deklaracjach podatkowych, formalnościach i rozliczeniach składek.",
            "priceHint": "wycena indywidualna",
            "confidence": "medium",
        },
        {
            "title": "Obsługa dokumentów",
            "description": "Pomoc w kompletowaniu dokumentów i wyjaśnianiu codziennych kwestii administracyjnych.",
            "priceHint": "wycena indywidualna",
            "confidence": "medium",
        },
    ]
    p["pricingPlans"] = [
        {
            "name": "Start",
            "subtitle": "Dla prostszych rozliczeń",
            "price": "wycena indywidualna",
            "features": [
                "Podstawowe rozliczenia zagraniczne",
                "Kontakt bezpośredni",
                "Pomoc przy dokumentach",
                "Wycena po krótkim opisie sprawy",
            ],
        },
        {
            "name": "Biznes",
            "subtitle": "Dla klientów z szerszym zakresem dokumentów",
            "price": "wycena indywidualna",
            "features": [
                "Szersze rozliczenia i formalności",
                "Wsparcie podatkowe",
                "Porządkowanie dokumentów",
                "Indywidualny model współpracy",
            ],
        },
        {
            "name": "Premium",
            "subtitle": "Dla bardziej złożonych spraw",
            "price": "wycena indywidualna",
            "features": [
                "Bardziej złożone przypadki",
                "Priorytetowy kontakt",
                "Szersza analiza dokumentów",
                "Wycena po analizie sytuacji",
            ],
        },
    ]
    set_team_solo(
        p,
        "Biuro Rozliczeń Zagranicznych",
        "Właścicielka i opiekunka współpracy",
        "Rozliczenia zagraniczne, podatki i ZUS",
    )

    # Hencel
    p = profiles["hencel-biuro-rachunkowe-poznan"]
    p["displayName"] = "Hencel Biuro Rachunkowe"
    p["navName"] = "Hencel Biuro Rachunkowe"
    p["tagline"] = (
        "Prowadzę biuro rachunkowe dla firm, które chcą mieć terminowe rozliczenia, porządek w dokumentach i spokojny, bezpośredni kontakt."
    )
    p["hero"] = {
        "titleTop": "Hencel Biuro Rachunkowe",
        "text": "Prowadzę księgowość dla przedsiębiorców, którzy oczekują rzetelności, jasnych zasad współpracy i wsparcia dopasowanego do codziennych potrzeb firmy.",
        "image": "/images/solo-female-owner.jpg?v=1",
        "imagePositionMobile": "center 22%",
        "imagePositionDesktop": "center 20%",
    }
    p["valueProps"] = [
        "Bezpośredni kontakt i spokojna współpraca",
        "Księgowość prowadzona terminowo i czytelnie",
        "Oferta dopasowana do skali działalności",
    ]
    p["services"] = [
        {
            "title": "KPiR i ryczałt",
            "description": "Obsługa uproszczonej księgowości dla działalności gospodarczych i mniejszych firm.",
            "priceHint": "wycena indywidualna",
            "confidence": "high",
        },
        {
            "title": "Kadry i płace",
            "description": "Wsparcie przy podstawowych sprawach kadrowo-płacowych i rozliczeniach ZUS.",
            "priceHint": "wycena indywidualna",
            "confidence": "medium",
        },
        {
            "title": "Rozliczenia podatkowe",
            "description": "Pomoc w deklaracjach i bieżących obowiązkach podatkowych firmy.",
            "priceHint": "wycena indywidualna",
            "confidence": "medium",
        },
    ]
    p["pricingPlans"] = [
        {
            "name": "Start",
            "subtitle": "Dla JDG i małych firm",
            "price": "wycena indywidualna",
            "features": [
                "KPiR lub ryczałt",
                "Podatki i ZUS",
                "Stały kontakt",
                "Zakres ustalany indywidualnie",
            ],
        },
        {
            "name": "Biznes",
            "subtitle": "Dla firm z większą liczbą dokumentów",
            "price": "wycena indywidualna",
            "features": [
                "Szersza obsługa księgowa",
                "Kadry i płace",
                "Wsparcie operacyjne",
                "Model dopasowany do firmy",
            ],
        },
        {
            "name": "Premium",
            "subtitle": "Dla bardziej złożonych rozliczeń",
            "price": "wycena indywidualna",
            "features": [
                "Indywidualny zakres obsługi",
                "Priorytetowy kontakt",
                "Szersze wsparcie księgowe",
                "Wycena po analizie potrzeb",
            ],
        },
    ]
    set_team_solo(
        p,
        "Hencel Biuro Rachunkowe",
        "Właścicielka i opiekunka współpracy",
        "Księgowość i podatki",
    )

    # Polskie Centrum Rachunkowosci
    p = profiles["polskie-centrum-rachunkowosci"]
    p["displayName"] = "Polskie Centrum Rachunkowości"
    p["navName"] = "Polskie Centrum Rachunkowości"
    p["tagline"] = (
        "Prowadzę biuro rachunkowe dla firm, które szukają spokojnej współpracy, terminowych rozliczeń i uporządkowanej obsługi dokumentów."
    )
    p["hero"] = {
        "titleTop": "Polskie Centrum Rachunkowości",
        "text": "Prowadzę obsługę księgową dla przedsiębiorców, którzy chcą mieć jasny model współpracy, bezpośredni kontakt i rzetelne wsparcie w codziennych rozliczeniach.",
        "image": "/images/solo-female-owner.jpg?v=1",
        "imagePositionMobile": "center 22%",
        "imagePositionDesktop": "center 20%",
    }
    p["valueProps"] = [
        "Bezpośredni kontakt i spokojna współpraca",
        "Terminowe rozliczenia i porządek w dokumentach",
        "Obsługa dopasowana do potrzeb firmy",
    ]
    p["services"] = [
        {
            "title": "KPiR i ryczałt",
            "description": "Prowadzenie uproszczonej księgowości dla działalności gospodarczych i mniejszych firm.",
            "priceHint": "wycena indywidualna",
            "confidence": "high",
        },
        {
            "title": "Kadry i płace",
            "description": "Wsparcie w dokumentach pracowniczych i bieżących rozliczeniach kadrowych.",
            "priceHint": "wycena indywidualna",
            "confidence": "medium",
        },
        {
            "title": "Rozliczenia podatkowe",
            "description": "Pomoc przy deklaracjach i codziennych obowiązkach podatkowych przedsiębiorcy.",
            "priceHint": "wycena indywidualna",
            "confidence": "medium",
        },
    ]
    p["pricingPlans"] = [
        {
            "name": "Start",
            "subtitle": "Dla małych firm",
            "price": "wycena indywidualna",
            "features": [
                "KPiR lub ryczałt",
                "Podatki i ZUS",
                "Stały kontakt",
                "Zakres ustalany indywidualnie",
            ],
        },
        {
            "name": "Biznes",
            "subtitle": "Dla firm z szerszym zakresem",
            "price": "wycena indywidualna",
            "features": [
                "Szersza obsługa księgowa",
                "Kadry i płace",
                "Bieżące wsparcie",
                "Indywidualny proces współpracy",
            ],
        },
        {
            "name": "Premium",
            "subtitle": "Dla bardziej złożonych przypadków",
            "price": "wycena indywidualna",
            "features": [
                "Indywidualny zakres prac",
                "Priorytetowy kontakt",
                "Szersze wsparcie podatkowe",
                "Wycena po analizie potrzeb",
            ],
        },
    ]
    set_team_solo(
        p,
        "Polskie Centrum Rachunkowości",
        "Właścicielka i opiekunka współpracy",
        "Księgowość i podatki",
    )

    # Broken hero copy
    profiles["biuro-rachunkowe-aneta-milewska-koz-owska-ksiegowosc-us-ugi-ksiegowe"][
        "hero"
    ][
        "text"
    ] = "Nasz zespół prowadzi pełną księgowość i podatki dla firm, które oczekują sprawnej komunikacji, uporządkowanego obiegu dokumentów i wsparcia dopasowanego do skali działalności."
    profiles["biuro-rachunkowe-mk-paw-owscy"]["hero"]["text"] = (
        "Nasz zespół prowadzi pełną księgowość i podatki dla firm, które oczekują sprawnej komunikacji, uporządkowanego obiegu dokumentów i współpracy dopasowanej do realnych potrzeb przedsiębiorstwa."
    )
    profiles["jeske-magdalena-auditor-accounting-office"]["hero"]["text"] = (
        "Nasz zespół prowadzi pełną księgowość i podatki dla firm, które oczekują sprawnej komunikacji, uporządkowanego obiegu dokumentów i wsparcia dopasowanego do realnych potrzeb biznesu."
    )


def stage2_pricing(profiles: dict) -> None:
    specific = {
        "ak-plus-biuro-rachunkowe-anna-klupczynska",
        "biuro-rachunkowe-capital-sp-z-o-o",
        "biuro-rachunkowe-clear-finance-sp-z-o-o",
        "biuro-rachunkowe-income-tax-weronika-greda",
        "biuro-rachunkowe-jw",
        "biuro-rachunkowe-atoran",
        "biuro-rachunkowe-pit",
        "biuro-rachunkowe-poznan",
        "biuro-rachunkowe-punkt-sp-z-o-o",
        "biuro-rachunkowe-wera",
        "certyfikowane-biuro-rachunkowe-rzis-pl",
        "fakturtax-biuro-rachunkowe-poznan",
        "g-tax",
        "in-come-sp-z-o-o",
        "in-plus-tax",
        "invoice-tax",
        "kancelaria-centrum",
        "kancelaria-doradcy-podatkowego-anna-cegielska",
        "magdalena-mielcarek",
        "md-biuro-rachunkowe-ma-gorzata-dudziak",
        "optimum-accounting-office-poznan",
        "pg-partner-gospodarczy",
        "profit-biuro-rachunkowe",
        "spectrum-biuro-rachunkowe",
        "taxcoach-sp-z-o-o-biuro-rachunkowe",
        "taxeo-accounting-office-poznan",
        "taxodus-biuro-ksiegowe-poznan-awica-biuro-rachunkowe",
        "taxshield-biuro-rachunkowe-online",
        "biuro-rachunkowe-taxo",
        "biuro-rachunkowe-molard",
    }
    for slug in specific:
        if slug in profiles:
            indywidualna(profiles[slug])
    for profile in profiles.values():
        maybe_clean_prices(profile)


def stage3_messaging(profiles: dict) -> None:
    # Reduce KSeF overuse and personalize named brands
    replacements = {
        "biuro-rachunkowe-infinitum-ksiegowosc-e-commerce": {
            "tagline": "Wspieramy firmy e-commerce i sprzedaż online w księgowości, podatkach oraz porządkowaniu dokumentów przy rosnącej skali działalności.",
            "hero_text": "Nasz zespół prowadzi księgowość dla e-commerce, sklepów internetowych i firm rozwijających sprzedaż online, dbając o porządek w dokumentach, podatkach i codziennej komunikacji.",
            "value_prop": "Obsługa dopasowana do e-commerce, marketplace i sprzedaży online",
        },
        "biuro-rachunkowe-pro-progress": {
            "tagline": "Wspieramy firmy w księgowości, podatkach i porządkowaniu procesów, zapewniając stały kontakt i współpracę dopasowaną do skali działalności.",
            "hero_text": "Nasz zespół prowadzi księgowość i podatki dla firm, które oczekują uporządkowanych procesów, sprawnej komunikacji i wsparcia przy codziennych decyzjach operacyjnych.",
        },
        "business-profit-biuro-rachunkowe": {
            "tagline": "Wspieramy firmy w księgowości, podatkach i bieżącej organizacji rozliczeń, pomagając zachować porządek i lepszą kontrolę nad finansami biznesu.",
            "hero_text": "Nasz zespół prowadzi księgowość dla firm, które chcą mieć uporządkowane rozliczenia, sprawną komunikację i wsparcie przy rozwoju działalności.",
        },
        "kancelaria-rachunkowa-denarius-sp-z-o-o": {
            "tagline": "Wspieramy firmy w księgowości, podatkach i bieżącej obsłudze kancelaryjnej, zapewniając stały kontakt i uporządkowane rozliczenia.",
            "hero_text": "Nasz zespół prowadzi księgowość i podatki dla firm, które oczekują rzetelnej obsługi kancelaryjnej, sprawnej komunikacji i bezpiecznego obiegu dokumentów.",
        },
        "wikom-biuro-rachunkowe": {
            "tagline": "Wspieramy firmy w księgowości, podatkach i porządkowaniu dokumentów, zapewniając stały kontakt i czytelny proces współpracy.",
            "hero_text": "Nasz zespół prowadzi księgowość i podatki dla firm, które oczekują sprawnej komunikacji, uporządkowanego obiegu dokumentów i stabilnego wsparcia na co dzień.",
        },
        "biuro-prawno-rachunkowe-maciej-skorupinski": {
            "tagline": "Łączymy obsługę rachunkową i szersze wsparcie formalno-podatkowe dla firm, które oczekują spokojnej współpracy i czytelnych zasad.",
            "hero_text": "Nasze biuro prawno-rachunkowe wspiera firmy w księgowości, podatkach i codziennych formalnościach, dbając o porządek w dokumentach i sprawny kontakt.",
        },
        "biuro-rachunkowe-krzysztof-bejgerowski": {
            "tagline": "Biuro Krzysztofa Bejgerowskiego wspiera firmy w księgowości, kadrach i podatkach, łącząc bezpośredni kontakt z uporządkowanym procesem współpracy.",
            "hero_text": "Zespół Biura Rachunkowego Krzysztofa Bejgerowskiego prowadzi księgowość dla firm, które oczekują terminowych rozliczeń, jasnej komunikacji i stabilnego wsparcia.",
        },
        "kancelaria-doradcy-podatkowego-anna-cegielska": {
            "tagline": "Wspieramy firmy w księgowości, podatkach i bieżących decyzjach rozliczeniowych, zapewniając bardziej doradczy charakter współpracy.",
            "hero_text": "Zespół kancelarii podatkowej wspiera firmy w rozliczeniach, księgowości i codziennych sprawach podatkowych, dbając o bezpieczeństwo i czytelne zasady współpracy.",
        },
        "kancelaria-podatkowa-andrzej-nowak-sp-z-o-o": {
            "tagline": "Wspieramy firmy w księgowości i podatkach, zapewniając kancelaryjny standard obsługi, stały kontakt i uporządkowany obieg dokumentów.",
            "hero_text": "Zespół kancelarii podatkowej prowadzi księgowość i wspiera firmy w sprawach podatkowych, dbając o bezpieczeństwo, komunikację i porządek w rozliczeniach.",
        },
        "kancelaria-us-ug-ksiegowych-tyniec-partnerzy": {
            "tagline": "Wspieramy firmy w księgowości i kadrach, zapewniając partnerski model współpracy, stały kontakt i uporządkowane rozliczenia.",
            "hero_text": "Zespół kancelarii księgowej wspiera firmy w bieżącej obsłudze rachunkowej, kadrach i rozliczeniach, dbając o partnerską współpracę i czytelny proces komunikacji.",
        },
        "renata-pempera-biuro-rachunkowe": {
            "tagline": "Biuro Renaty Pembery wspiera firmy w księgowości, kadrach i podatkach, łącząc bezpośredni kontakt z uporządkowaną obsługą rozliczeń.",
            "hero_text": "Zespół Biura Rachunkowego Renaty Pembery prowadzi księgowość dla firm, które oczekują terminowych rozliczeń, spokojnego kontaktu i jasnych zasad współpracy.",
        },
        "fineko-accounting-poznan": {
            "tagline": "Profesjonalna obsługa księgowa i kadrowo-płacowa dla małych i średnich firm w Poznaniu, prowadzona czytelnie, terminowo i z nastawieniem na realne wsparcie biznesu.",
            "hero_text": "Fineko prowadzi księgowość i kadry dla firm, które chcą mieć uporządkowane rozliczenia, dobry kontakt roboczy i wsparcie na kolejnych etapach rozwoju działalności.",
        },
        "booq-sp-z-o-o": {
            "tagline": "Wspieramy firmy w księgowości, kadrach i bieżących rozliczeniach, stawiając na prostą komunikację, porządek danych i nowoczesny model współpracy.",
            "hero_text": "Zespół booq prowadzi księgowość dla firm, które chcą mieć przejrzyste rozliczenia, sprawną komunikację i uporządkowany obieg dokumentów.",
        },
    }
    for slug, data in replacements.items():
        if slug not in profiles:
            continue
        p = profiles[slug]
        if data.get("tagline"):
            p["tagline"] = data["tagline"]
        if data.get("hero_text"):
            p.setdefault("hero", {})["text"] = data["hero_text"]
        if data.get("value_prop"):
            vals = p.get("valueProps", [])
            if len(vals) > 1:
                vals[1] = data["value_prop"]
                p["valueProps"] = vals


def stage4_polish(profiles: dict) -> None:
    updates = {
        "accounting-office-rachunkovnia-sp-o-o": (
            "Zespół księgowy dla firm i spółek",
            "Rachunkovnia wspiera firmy w księgowości, kadrach i podatkach, łącząc uporządkowany proces współpracy z bardziej nowoczesnym, partnerskim stylem obsługi.",
        ),
        "as-ksiegowosc-sp-z-o-o": (
            "Księgowość, podatki i stabilna obsługa firm",
            "AS Księgowość wspiera firmy w księgowości, kadrach i podatkach, dbając o terminowość rozliczeń, przejrzystą komunikację i spokojny model współpracy.",
        ),
        "awm-zarzadzanie-rachunkowoscia-spo-ka-z-o-o": (
            "Rachunkowość i wsparcie operacyjne dla firm",
            "AWM wspiera firmy w rachunkowości, kadrach i podatkach, stawiając na uporządkowany obieg dokumentów i stabilną obsługę dla rosnących organizacji.",
        ),
        "biuro-rachunkowe-lmb-office": (
            "Księgowość i obsługa firm w nowoczesnym modelu",
            "LMB Office prowadzi księgowość dla firm, które chcą mieć uporządkowane rozliczenia, sprawną komunikację i elastyczny model współpracy.",
        ),
        "biuro-rachunkowe-kmt-finance": (
            "Finanse, księgowość i obsługa rozwoju firmy",
            "KMT Finance wspiera firmy w księgowości, kadrach i podatkach, dbając o porządek w rozliczeniach i bardziej biznesowy charakter współpracy.",
        ),
        "biuro-rachunkowe-mm-accounting-sp-z-o-o": (
            "Accounting i księgowość dla rozwijających się firm",
            "MM Accounting wspiera firmy w księgowości, kadrach i podatkach, zapewniając uporządkowany obieg dokumentów i partnerski styl codziennej współpracy.",
        ),
        "biuro-rachunkowe-sodelis": (
            "Księgowość i podatki prowadzone spokojnie i czytelnie",
            "SODELIS wspiera firmy w księgowości, kadrach i podatkach, stawiając na terminowość rozliczeń i stabilny model współpracy.",
        ),
        "libra-biuro-rachunkowe": (
            "Rachunkowość i kadry dla firm, które chcą porządku",
            "Libra Biuro Rachunkowe wspiera firmy w księgowości, podatkach i kadrach, zapewniając stały kontakt oraz uporządkowany proces codziennych rozliczeń.",
        ),
        "ksiegowy-expert": (
            "Ekspercka księgowość i podatki dla firm",
            "Księgowy EXPERT wspiera firmy w księgowości, podatkach i kadrach, stawiając na rzetelność, terminowość i czytelną komunikację roboczą.",
        ),
    }
    for slug, (accent, hero_text) in updates.items():
        if slug in profiles:
            profiles[slug].setdefault("hero", {})["titleAccent"] = accent
            profiles[slug]["hero"]["text"] = hero_text


def stage5_brand_and_sendoff(profiles: dict) -> None:
    tailored = {
        "biuro-rachunkowe-elzbieta-wawrzyniak": {
            "tagline": "Biuro Elżbiety Wawrzyniak wspiera firmy w księgowości, kadrach i bieżących rozliczeniach, łącząc bezpośredni kontakt z uporządkowanym procesem pracy.",
            "hero_text": "Zespół Biura Rachunkowego Elżbiety Wawrzyniak prowadzi księgowość dla firm, które oczekują terminowych rozliczeń, spokojnej komunikacji i wsparcia dopasowanego do codziennych potrzeb działalności.",
            "accent": "Księgowość i kadry prowadzone odpowiedzialnie",
        },
        "biuro-rachunkowe-stefanska-anna": {
            "tagline": "Biuro Anny Stefańskiej wspiera firmy w księgowości, podatkach i bieżących rozliczeniach, zapewniając spokojną współpracę i czytelny model obsługi.",
            "hero_text": "Zespół Biura Rachunkowego Anny Stefańskiej prowadzi księgowość dla firm, które chcą mieć uporządkowane dokumenty, sprawną komunikację i wsparcie także przy KSeF oraz e-dokumentach.",
            "accent": "Księgowość i podatki z osobistym nadzorem",
        },
        "kancelaria-doradcy-podatkowego-anna-cegielska": {
            "tagline": "Kancelaria wspiera firmy w księgowości, podatkach i bieżących decyzjach rozliczeniowych, zapewniając bardziej doradczy charakter współpracy i porządek w dokumentach.",
            "hero_text": "Zespół Kancelarii Doradcy Podatkowego Anny Cegielskiej wspiera firmy w rozliczeniach, księgowości i codziennych sprawach podatkowych, dbając o bezpieczeństwo, kontakt i czytelne zasady współpracy.",
            "accent": "Kancelaryjne wsparcie w podatkach i księgowości",
        },
        "kancelaria-podatkowa-andrzej-nowak-sp-z-o-o": {
            "tagline": "Kancelaria Podatkowa Andrzeja Nowaka wspiera firmy w księgowości i podatkach, zapewniając kancelaryjny standard obsługi, stały kontakt i uporządkowane rozliczenia.",
            "hero_text": "Zespół Kancelarii Podatkowej Andrzeja Nowaka prowadzi księgowość i wspiera firmy w sprawach podatkowych, dbając o bezpieczeństwo decyzji, komunikację i porządek w dokumentach.",
            "accent": "Podatki i księgowość w standardzie kancelarii",
        },
        "kancelaria-us-ug-ksiegowych-tyniec-partnerzy": {
            "tagline": "Kancelaria Tyniec & Partnerzy wspiera firmy w księgowości, kadrach i rozliczeniach, zapewniając partnerski model współpracy i uporządkowany proces obsługi.",
            "hero_text": "Zespół Kancelarii Usług Księgowych Tyniec & Partnerzy wspiera firmy w bieżącej obsłudze rachunkowej, kadrach i rozliczeniach, dbając o partnerską komunikację i czytelny obieg dokumentów.",
            "accent": "Partnerska obsługa księgowa dla firm",
        },
        "renata-pempera-biuro-rachunkowe": {
            "tagline": "Biuro Renaty Pembery wspiera firmy w księgowości, kadrach i podatkach, łącząc uporządkowaną obsługę rozliczeń z bardziej osobistym kontaktem.",
            "hero_text": "Zespół Biura Rachunkowego Renaty Pembery prowadzi księgowość dla firm, które oczekują terminowych rozliczeń, spokojnej komunikacji i jasnych zasad współpracy.",
            "accent": "Księgowość, kadry i podatki z osobistym podejściem",
        },
        "marta-sowa": {
            "tagline": "Biuro Marty Sowy wspiera firmy w KPiR, kadrach i bieżących rozliczeniach, zapewniając sprawny kontakt i uporządkowaną codzienną obsługę.",
            "hero_text": "Zespół Biura Marty Sowy prowadzi rozliczenia dla firm, które chcą mieć porządek w dokumentach, spokojną współpracę i czytelny model obsługi na co dzień.",
            "accent": "Księgowość i kadry w codziennej współpracy",
        },
        "magdalena-mielcarek": {
            "tagline": "Biuro Magdaleny Mielcarek wspiera firmy w księgowości, kadrach i podatkach, zapewniając bezpośredni kontakt i uporządkowany proces rozliczeń.",
            "hero_text": "Zespół Biura Magdaleny Mielcarek prowadzi księgowość dla firm, które oczekują terminowości, spokojnej komunikacji i wsparcia dopasowanego do skali działalności.",
            "accent": "Księgowość i podatki z osobistym charakterem marki",
        },
        "jan-pietrzak": {
            "tagline": "Biuro Jana Pietrzaka wspiera firmy w księgowości, kadrach i bieżących rozliczeniach, łącząc bardziej osobisty charakter marki z uporządkowanym procesem pracy.",
            "hero_text": "Zespół Biura Jana Pietrzaka prowadzi rozliczenia dla firm, które oczekują terminowych działań, dobrego kontaktu i spokojnego modelu współpracy.",
            "accent": "Księgowość i rozliczenia pod marką nazwiskową",
        },
        "ksiegowa-ewa-wojciechowska": {
            "tagline": "Biuro Ewy Wojciechowskiej wspiera firmy w KPiR, kadrach i codziennych rozliczeniach, zapewniając stały kontakt i czytelne zasady współpracy.",
            "hero_text": "Zespół Biura Ewy Wojciechowskiej prowadzi rozliczenia dla firm, które chcą mieć porządek w dokumentach, terminowość i spokojne wsparcie w bieżących obowiązkach.",
            "accent": "Księgowość i kadry z osobistą odpowiedzialnością",
        },
        "biuro-rachunkowe-poznan-jozwicki-partners": {
            "tagline": "Jóźwicki & Partners wspiera firmy w księgowości, kadrach i podatkach, zapewniając bardziej partnerski model współpracy i uporządkowany obieg dokumentów.",
            "hero_text": "Zespół Biura Rachunkowego Jóźwicki & Partners prowadzi księgowość dla firm, które oczekują terminowych rozliczeń, sprawnej komunikacji i solidnego wsparcia przy codziennych decyzjach finansowych.",
            "accent": "Partnerska obsługa księgowa dla firm i spółek",
        },
        "biuro-rachunkowe-poznan-noblesse": {
            "tagline": "Noblesse wspiera firmy w księgowości, kadrach i podatkach, zapewniając bardziej uporządkowaną, elegancką i przewidywalną obsługę rozliczeń.",
            "hero_text": "Zespół Biura Rachunkowego Noblesse prowadzi księgowość dla firm, które oczekują sprawnej komunikacji, wysokiej kultury współpracy i stabilnego wsparcia w codziennych rozliczeniach.",
            "accent": "Uporządkowana księgowość w bardziej premium tonie",
        },
        "biuro-rachunkowe-poznan-nowoczesne-systemy-finansowe": {
            "tagline": "Nowoczesne Systemy Finansowe wspierają firmy w księgowości, kadrach i podatkach, łącząc uporządkowane procesy z bardziej nowoczesnym stylem pracy.",
            "hero_text": "Nasz zespół prowadzi księgowość dla firm, które chcą mieć sprawną komunikację, uporządkowany obieg dokumentów i bardziej nowoczesny model współpracy przy rozliczeniach.",
            "accent": "Nowoczesna księgowość i procesy dla firm",
        },
        "biuro-rachunkowe-value-business": {
            "tagline": "Value Business wspiera firmy w księgowości, kadrach i podatkach, łącząc porządek w rozliczeniach z bardziej biznesowym spojrzeniem na współpracę.",
            "hero_text": "Nasz zespół prowadzi księgowość dla firm, które oczekują terminowych rozliczeń, czytelnej komunikacji i wsparcia przy codziennym prowadzeniu biznesu.",
            "accent": "Księgowość i podatki z biznesowym nastawieniem",
        },
        "booq-sp-z-o-o": {
            "tagline": "booq wspiera firmy w księgowości, kadrach i rozliczeniach, stawiając na prostą komunikację, uporządkowane dane i nowoczesny model współpracy.",
            "hero_text": "Zespół booq prowadzi księgowość dla firm, które chcą mieć przejrzyste rozliczenia, szybki kontakt i sprawny obieg dokumentów bez zbędnego chaosu.",
            "accent": "Nowoczesna obsługa księgowa dla rosnących firm",
        },
        "fineko-accounting-poznan": {
            "tagline": "Fineko prowadzi obsługę księgową i kadrowo-płacową dla małych i średnich firm w Poznaniu, działając rzetelnie, terminowo i bardzo czytelnie dla klienta.",
            "hero_text": "Fineko wspiera firmy w księgowości i kadrach od startu działalności po kolejne etapy rozwoju, dbając o porządek w rozliczeniach i spokojny kontakt roboczy.",
            "accent": "Księgowość i kadry prowadzone przejrzyście",
        },
        "in-plus-tax": {
            "tagline": "IN PLUS TAX wspiera firmy w księgowości, kadrach i podatkach, zapewniając jasne zasady współpracy i porządek w codziennych rozliczeniach.",
            "hero_text": "Nasz zespół prowadzi rozliczenia dla firm, które oczekują terminowości, sprawnej komunikacji i stabilnego wsparcia w księgowości oraz podatkach.",
            "accent": "Księgowość i podatki w uporządkowanym modelu",
        },
        "taxcoach-sp-z-o-o-biuro-rachunkowe": {
            "display": "TaxCoach Biuro Rachunkowe",
            "tagline": "TaxCoach wspiera firmy w księgowości, kadrach i rozliczeniach, łącząc porządek danych z bardziej doradczym stylem współpracy.",
            "hero_text": "Nasz zespół prowadzi rozliczenia dla firm, które oczekują sprawnej komunikacji, czytelnych zasad i wsparcia w codziennych decyzjach księgowo-podatkowych.",
            "accent": "Księgowość i podatki w bardziej doradczym tonie",
        },
        "sobieraj-i-kuzmin-sp-z-o-o-biuro-rachunkowe-poznan": {
            "display": "Sobieraj i Kuźmin Biuro Rachunkowe Poznań",
            "tagline": "Sobieraj i Kuźmin wspierają firmy w księgowości, podatkach i bieżących rozliczeniach, zapewniając partnerski model współpracy i uporządkowany obieg dokumentów.",
            "hero_text": "Zespół Sobieraj i Kuźmin prowadzi księgowość dla firm, które oczekują spokojnej komunikacji, terminowych rozliczeń i stabilnego wsparcia w codziennym prowadzeniu działalności.",
            "accent": "Partnerska księgowość i podatki dla firm",
        },
        "kancelaria-centrum": {
            "tagline": "Kancelaria Centrum wspiera firmy w księgowości, podatkach i uporządkowaniu rozliczeń, zapewniając kancelaryjny standard obsługi i sprawną komunikację.",
            "hero_text": "Zespół Kancelarii Centrum prowadzi księgowość i wspiera firmy w sprawach podatkowych oraz dokumentacyjnych, dbając o bezpieczeństwo decyzji i porządek w procesach.",
            "accent": "Kancelaryjna obsługa księgowa i podatkowa",
        },
        "kancelaria-gospodarcza-szatkowscy-i-wspolnicy-sp-z-o-o": {
            "tagline": "Kancelaria Gospodarcza Szatkowscy i Wspólnicy wspiera firmy w księgowości, podatkach i kadrach, zapewniając uporządkowaną obsługę i partnerski model współpracy.",
            "hero_text": "Zespół kancelarii wspiera firmy w rozliczeniach, księgowości i codziennych decyzjach formalnych, dbając o porządek dokumentów i bezpieczny kontakt roboczy.",
            "accent": "Kancelaria gospodarcza dla firm i spółek",
        },
        "kancelaria-laurus-sp-z-o-o": {
            "tagline": "Kancelaria Laurus wspiera firmy w księgowości, kadrach i rozliczeniach, łącząc uporządkowaną obsługę z kancelaryjnym standardem współpracy.",
            "hero_text": "Zespół Kancelarii Laurus prowadzi rozliczenia dla firm, które oczekują terminowości, spokojnej komunikacji i czytelnego modelu codziennej obsługi.",
            "accent": "Kancelaryjna księgowość i kadry dla firm",
        },
        "kancelaria-podatkowa-sas-tax": {
            "tagline": "SAS TAX wspiera firmy w księgowości, kadrach i podatkach, zapewniając bardziej ekspercki charakter współpracy i uporządkowany proces rozliczeń.",
            "hero_text": "Zespół Kancelarii Podatkowej SAS TAX prowadzi rozliczenia dla firm, które oczekują sprawnej komunikacji, porządku w dokumentach i solidnego wsparcia podatkowego.",
            "accent": "Eksperckie wsparcie podatkowe i księgowe",
        },
        "pietkun-kancelaria-rachunkowa": {
            "tagline": "Kancelaria Rachunkowa Pietkun wspiera firmy w księgowości, kadrach i podatkach, zapewniając spokojną komunikację i uporządkowany model współpracy.",
            "hero_text": "Zespół kancelarii prowadzi księgowość dla firm, które oczekują terminowych rozliczeń, czytelnych zasad i stabilnego wsparcia w codziennych obowiązkach.",
            "accent": "Kancelaryjna obsługa rozliczeń dla firm",
        },
        "nowypit-pl-biuro-prawno-rachunkowe": {
            "tagline": "Nowypit.pl wspiera firmy w księgowości, podatkach i bieżących formalnościach, łącząc porządek w rozliczeniach z bardziej usługowym, nowoczesnym stylem komunikacji.",
            "hero_text": "Nasz zespół prowadzi obsługę prawno-rachunkową dla firm, które oczekują czytelnych zasad, sprawnego kontaktu i uporządkowanego obiegu dokumentów.",
            "accent": "Nowoczesna obsługa prawno-rachunkowa",
        },
    }

    for slug, data in tailored.items():
        if slug not in profiles:
            continue
        p = profiles[slug]
        if data.get("display"):
            p["displayName"] = data["display"]
            p["navName"] = (
                data["display"]
                if len(data["display"]) <= 28
                else data["display"][:28].rsplit(" ", 1)[0] + "..."
            )
            p.setdefault("hero", {})["titleTop"] = data["display"]
        if data.get("tagline"):
            p["tagline"] = data["tagline"]
        if data.get("hero_text"):
            p.setdefault("hero", {})["text"] = data["hero_text"]
        if data.get("accent"):
            p.setdefault("hero", {})["titleAccent"] = data["accent"]


def main() -> None:
    profiles = load_profiles()
    stage1_incomplete_and_broken(profiles)
    stage2_pricing(profiles)
    stage3_messaging(profiles)
    stage4_polish(profiles)
    stage5_brand_and_sendoff(profiles)
    save_profiles(profiles)
    print(MANUAL_TS)


if __name__ == "__main__":
    main()
