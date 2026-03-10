# Bydgoszcz Pricing Research (very detailed)

Date: 2026-02-21
Scope: personal training prices in Bydgoszcz (single sessions + packages), with actionable Starter/Growth/Pro recommendation and 90-day pilot-to-standard rollout.

## 1) Research objective

Build a pricing model grounded in real local market evidence:

- benchmark current market floor, core, and premium rates,
- compare single-session vs package economics,
- propose a 3-tier offer (`Starter`, `Growth`, `Pro`),
- define a 90-day entry strategy (`pilot -> standard`) with concrete price transitions.

## 2) Methodology

### 2.1 Source types

Used both marketplace and direct provider pages:

- Marketplaces: Booksy, ZnanyLekarz
- Direct trainer/studio pages: DariaFit, Bartosz Jaszczak, RUCH studio, Radoslaw Habera, Rewital, FitLife, MS Studio, Ruch Naturalny, Brzezinski (running specialist)
- Context indicators (not merged into core comparable dataset): Fixly, Superprof snippet, local pricing article

### 2.2 Inclusion rules

Included only offers clearly tied to personal training (or very close 1:1 variants):

- single 1:1 sessions,
- package offers with explicit price,
- sessions with known duration converted to 60-min equivalent.

Excluded from core comparables:

- pure consultations without training session,
- unrelated services (beauty, non-training medical procedures, etc.),
- offers without explicit price.

### 2.3 Normalization

For comparability, each record has:

- `effective_price_per_session_pln`
- `effective_price_per_60m_pln`

Formula:

`effective_price_per_60m = effective_price_per_session * (60 / duration_min)`

### 2.4 Assumptions

One explicit assumption was required for `bartoszjaszczak.pl` monthly bundles:

- `2x/week = 8 sessions/month`
- `3x/week = 12 sessions/month`
- `4x/week = 16 sessions/month`

This assumption is flagged in the dataset as `direct_assumed_sessions`.

## 3) Raw dataset

Full machine-readable dataset:

- `Strona-trenerzy/reports/bydgoszcz_pricing_research_dataset_2026-02-21.csv`

Rows: **49** comparable offers.

## 4) Statistical results (comparable dataset)

### 4.1 Global distribution (PLN per 60 min equivalent)

- `n = 49`
- `min = 80.00`
- `p10 = 117.00`
- `p25 = 137.50`
- `median = 158.33`
- `p75 = 180.00`
- `p90 = 200.00`
- `max = 220.00`

### 4.2 Singles vs packages

- Singles (`n=26`): min `80.00`, median `165.00`, max `220.00`
- Packages (`n=22`): min `91.67`, median `156.67`, max `210.00`

Interpretation:

- package pricing is systematically lower per session,
- market center of gravity is clearly in the `~150-180` zone,
- premium premium-rate activity starts around `190+`.

### 4.3 Segment table (requested: min/median/max)

| Segment | Rule (PLN/60m) | n | Min | Median | Max |
|---|---:|---:|---:|---:|---:|
| Budget | <=130 | 10 | 80.00 | 113.00 | 126.00 |
| Core | 131-180 | 31 | 132.50 | 160.00 | 180.00 |
| Premium | >180 | 8 | 190.00 | 200.00 | 220.00 |

## 5) Source-level observations

Per-source medians (PLN/60m):

- Booksy: `150.90` (wide spread, promo-heavy)
- ZnanyLekarz: `175.00`
- DariaFit: `109.00` (strong budget positioning)
- Bartosz Jaszczak: `140.62` (packages drive down per-session rate)
- RUCH studio: `155.00`
- Radoslaw Habera: `170.00`
- Rewital: `121.88` (aggressive bundle strategy)
- FitLife: `190.00` (premium skew)
- MS Studio: `180.00`
- Ruch Naturalny: `168.75`
- Brzezinski (running specialist): `150.00`

## 6) Discount depth from packages

Best observed package discount vs single-session baseline:

- Rewital: `-38.9%`
- MS Studio: `-22.5%`
- RUCH studio: `-22.2%`
- DariaFit: `-16.8%`
- FitLife: `-11.1%`
- Radoslaw Habera: `-11.1%`

Implication:

- market accepts two distinct package logics:
  - moderate discount (`~10-17%`) for margin protection,
  - aggressive discount (`20%+`) for retention/volume play.

## 7) External context indicators (sanity check)

These are useful context markers but were not merged into the strict comparable dataset:

- Fixly: "Sredni koszt realizacji tej uslugi to 100 zl" (city-level platform average)
- DuckDuckGo snippet for Superprof listing: "godzinny trening personalny ... kosztuje srednio 164 zl"
- Local article (`silakonsekwencji.pl`): "w Bydgoszczy ... 120-200 zl za jednostke treningowa"

## 8) Recommended 3-tier offer (Starter/Growth/Pro)

### 8.1 Pricing rationale

Anchors used:

- median package economics: `~156.67 PLN/60m`
- core segment center: `~160 PLN/60m`
- practical Bydgoszcz package references around `~1200 / ~1600 / ~1900+` monthly

### 8.2 Recommended standard pricing (monthly)

| Tier | What client gets | Price | Effective per session |
|---|---|---:|---:|
| Starter | 4 sessions/month + basic plan + monthly check-in | **649 PLN** | 162.25 PLN |
| Growth | 8 sessions/month + training+nutrition guidance + weekly check-in | **1249 PLN** | 156.13 PLN |
| Pro | 12 sessions/month + priority support + full progress management | **1849 PLN** | 154.08 PLN |

Positioning:

- Starter: core-lower bound entry,
- Growth: direct median-market fit,
- Pro: higher ticket by scope/value, not by per-session inflation.

## 9) 90-day entry strategy (pilot -> standard)

### Phase 1: Days 1-30 (Pilot acquisition)

Goal: lower friction, maximize first conversions.

- Starter: `549 PLN`
- Growth: `1049 PLN`
- Pro: `1549 PLN`

Mechanics:

- fixed pilot slots (scarcity),
- mandatory onboarding diagnostic,
- clear transition date to standard pricing from day 31.

### Phase 2: Days 31-60 (Bridge)

Goal: reduce discount, stabilize quality and onboarding load.

- Starter: `599 PLN`
- Growth: `1149 PLN`
- Pro: `1699 PLN`

Mechanics:

- collect before/after evidence,
- publish case studies,
- use referral trigger after week 4.

### Phase 3: Days 61-90 (Standard)

Goal: lock in sustainable unit economics.

- Starter: `649 PLN`
- Growth: `1249 PLN`
- Pro: `1849 PLN`

Mechanics:

- keep pilot offer closed,
- optimize conversion script around proof and outcomes,
- upsell from Starter -> Growth during week 3-4 review.

## 10) KPI framework for rollout

Track weekly:

- consultation booking rate,
- consultation -> paid conversion,
- paid month-1 retention to month-2,
- share of clients by tier,
- effective revenue per active client.

Practical KPI targets for first 90 days:

- consultation -> paid: `>=35%`
- M1 -> M2 retention: `>=70%`
- Growth+Pro share by day 90: `>=55%`

## 11) Risks and caveats

- Some marketplace prices are promotional and can change quickly.
- A part of the sample comes from medical/functional variants; this naturally lifts premium tail.
- One source required session-count assumption for monthly frequency bundles (explicitly tagged in CSV).
- High-end offers often include additional value layers (support, diagnostics), so pure per-session comparison can understate value differentiation.

## 12) Direct source list used in this research

- https://booksy.com/pl-pl/s/trening-personalny/22068_bydgoszcz
- https://www.znanylekarz.pl/uslugi-zabiegi/trening-personalny/bydgoszcz
- https://dariafit.pl/cennik/
- https://bartoszjaszczak.pl/cennik/
- https://ruchstudio.pl/cennik/
- https://radoslawhabera.pl/
- http://rewital.byd.pl/79-cennik-trening-personalny
- https://fitlifestudio.pl/cennik/
- https://msstudiobydgoszcz.pl/cennik/
- https://ruchnaturalny.pl/trening-personalny/
- https://trenerbiegania-bydgoszcz.pl/cennik/
- https://fixly.pl/kategoria/trener-personalny/bydgoszcz
- https://duckduckgo.com/html/?q=bydgoszcz+trening+personalny+cennik+z%C5%82
- https://silakonsekwencji.pl/2025/07/22/ile-kosztuje-trener-personalny/
