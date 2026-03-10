# Raport wdrozenia poprawek po audytach

- Data: `2026-03-09`
- Zakres: wdrozenie poprawek po batchach recznego audytu `1-5`

## Etap 1 - profile niedokonczone i urwane copy

- Uzupelnione profile: `biuro-nix-us-ugi-ksiegowe-sp-z-o-o`, `biuro-rachunkowe-dm-sp-z-oo`, `biuro-rozliczen-zagranicznych`, `hencel-biuro-rachunkowe-poznan`, `polskie-centrum-rachunkowosci`
- Naprawione urwane hero copy: `biuro-rachunkowe-aneta-milewska-koz-owska-ksiegowosc-us-ugi-ksiegowe`, `biuro-rachunkowe-mk-paw-owscy`, `jeske-magdalena-auditor-accounting-office`

## Etap 2 - niepewne ceny na wycene indywidualna

- Na `wycena indywidualna` przestawione zostaly profile z podejrzanie niskimi, skrajnymi lub nielogicznymi cenami, m.in.:
- `ak-plus-biuro-rachunkowe-anna-klupczynska`
- `biuro-rachunkowe-capital-sp-z-o-o`
- `biuro-rachunkowe-clear-finance-sp-z-o-o`
- `biuro-rachunkowe-income-tax-weronika-greda`
- `biuro-rachunkowe-jw`
- `biuro-rachunkowe-atoran`
- `biuro-rachunkowe-pit`
- `biuro-rachunkowe-poznan`
- `biuro-rachunkowe-punkt-sp-z-o-o`
- `biuro-rachunkowe-wera`
- `certyfikowane-biuro-rachunkowe-rzis-pl`
- `fakturtax-biuro-rachunkowe-poznan`
- `g-tax`
- `in-come-sp-z-o-o`
- `in-plus-tax`
- `invoice-tax`
- `kancelaria-centrum`
- `kancelaria-doradcy-podatkowego-anna-cegielska`
- `magdalena-mielcarek`
- `md-biuro-rachunkowe-ma-gorzata-dudziak`
- `optimum-accounting-office-poznan`
- `pg-partner-gospodarczy`
- `profit-biuro-rachunkowe`
- `spectrum-biuro-rachunkowe`
- `taxcoach-sp-z-o-o-biuro-rachunkowe`
- `taxeo-accounting-office-poznan`
- `taxodus-biuro-ksiegowe-poznan-awica-biuro-rachunkowe`
- `taxshield-biuro-rachunkowe-online`
- `biuro-rachunkowe-taxo`
- `biuro-rachunkowe-molard`

## Etap 3 - poprawki komunikacji

- Ograniczony zostal zbyt mocny akcent `KSeF` tam, gdzie nie byl naturalny, m.in. w: `biuro-rachunkowe-infinitum-ksiegowosc-e-commerce`, `biuro-rachunkowe-pro-progress`, `business-profit-biuro-rachunkowe`, `kancelaria-rachunkowa-denarius-sp-z-o-o`, `wikom-biuro-rachunkowe`
- Wzmocniono bardziej personalny lub ekspercki ton dla marek nazwiskowych i kancelaryjnych, m.in. w: `biuro-prawno-rachunkowe-maciej-skorupinski`, `biuro-rachunkowe-krzysztof-bejgerowski`, `kancelaria-doradcy-podatkowego-anna-cegielska`, `kancelaria-podatkowa-andrzej-nowak-sp-z-o-o`, `kancelaria-us-ug-ksiegowych-tyniec-partnerzy`, `renata-pempera-biuro-rachunkowe`
- Dopracowane bardziej markowe hero / tagline dla: `fineko-accounting-poznan`, `booq-sp-z-o-o`

## Etap 4 - polish wybranych marek zespolowych

- Dopracowane akcenty hero i bardziej indywidualny ton dla: `accounting-office-rachunkovnia-sp-o-o`, `as-ksiegowosc-sp-z-o-o`, `awm-zarzadzanie-rachunkowoscia-spo-ka-z-o-o`, `biuro-rachunkowe-lmb-office`, `biuro-rachunkowe-kmt-finance`, `biuro-rachunkowe-mm-accounting-sp-z-o-o`, `biuro-rachunkowe-sodelis`, `libra-biuro-rachunkowe`, `ksiegowy-expert`

## Walidacja

- `npm run lint` - OK
- `npm run build` - OK
- `python scripts/final_ready_pages_qa.py` - `PASS=125 WARN=0 TOTAL=125`

## Pliki kluczowe

- Zmiany wdrozone w: `strona-demo/src/data/biura/biuroProfiles.manual.ts`
- Skrypt wdrozeniowy: `strona-demo/scripts/apply_audit_fixes.py`
- QA koncowe: `strona-demo/reports/ready_pages_final_qa.md`
