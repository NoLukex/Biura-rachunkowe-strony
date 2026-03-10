# Biura Content Workplan (email profiles)

## Scope
- Profiles in scope: records with non-empty `email`
- Current count: **118**
- Source files:
  - `src/data/biura/biuroResearch.generated.json`
  - `src/data/biura/biuroProfiles.manual.ts`
  - `reports/biura_manual_verification.csv`
  - `reports/biura_content_checklist.csv`

## Data to collect per biuro
1. Identity: `displayName`, `legalName`, `navName`
2. Contact: `email`, `phone`, `website`, `address`, `mapUrl`
3. Structure: `teamType` (`jednoosobowe`/`wieloosobowe`), `serviceModel`
4. Media: `hero.image`, `media.logoUrl`, `media.teamCandidateUrl`
5. Services + pricing: `services[]`, `pricingPlans[]`
6. Social: `socials.facebook|instagram|linkedin|youtube`

## Collection order (per profile)
1. Official website homepage
2. Internal subpages: `oferta/uslugi/cennik/o-nas/kontakt/zespol`
3. Social pages linked from website
4. CSV-provided social links
5. Email-domain website fallback (`https://<email-domain>`) when website is missing or social-only

## Automation status
- Verification pass status: **PASS 94 / WARN 29 / FAIL 2**
- Content readiness: **ready 30 / needs_review 88**
- Most common missing fields:
  - `socials` (69)
  - `pricing` (47)
  - `logo` (19)
  - `hero_photo` (10)

## Batch A queue (website + media first)
1. `kancelaria-rachunkowa-kmn-prestige-spo-ka-z-ograniczona` - website, hero, logo, team photo
2. `hencel-biuro-rachunkowe-poznan` - website, hero, logo, team photo
3. `smctax` - hero, logo, team photo
4. `polskie-centrum-rachunkowosci` - hero, logo, team photo
5. `libra-biuro-rachunkowe` - hero, logo, team photo
6. `infakt` - hero, logo, team photo
7. `in-come-sp-z-o-o` - hero, logo, team photo
8. `biuro-rachunkowe-mk-paw-owscy` - hero, logo
9. `biuro-rachunkowe-jw` - hero, logo
10. `zmarz-jolanta-biuro-rachunkowe` - hero, team photo

## Manual QA priority
1. `website` missing/unreachable
2. `hero_photo` + `logo` missing together
3. `pricing` missing (confirm real package pricing)
4. `socials` missing (verify if profiles exist)

## Ready criteria
A profile is `ready` when all are true:
- website fetched
- phone present
- hero photo is not fallback image
- logo present
- team type resolved
- pricing found
- at least one social link present
