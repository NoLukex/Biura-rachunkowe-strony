# Solo Offices Batch

Date: 2026-03-09
Scope: first batch of 5 confirmed single-owner accounting offices adapted to the `GAMA` pattern.

## Updated slugs

1. `biuro-rachunkowe-ms-monika-stefaniak-poznan`
2. `biuro-rachunkowe-natalia-wanat`
3. `katarzyna-burzynska`
4. `profit-biuro-rachunkowe`
5. `zmarz-jolanta-biuro-rachunkowe`

## What was standardized

- `teamType` set to `jednoosobowe`
- one-person layout with the same image in hero and team section
- owner name and role filled in for the solo card
- more personal hero copy and owner-led positioning
- pricing plans and service descriptions made more concrete
- contact details expanded where public source data confirmed them

## Notes per profile

### `biuro-rachunkowe-ms-monika-stefaniak-poznan`
- Reframed around Monika Stefaniak as owner-led solo office.
- Added direct-contact positioning, updated pricing copy, and matched hero/team imagery.

### `biuro-rachunkowe-natalia-wanat`
- Reframed around Natalia Wanat with stronger solo-owner messaging.
- Added confirmed socials and more concrete pricing based on the public cennik page.

### `katarzyna-burzynska`
- Rebuilt as solo-owner office with copy based on public first-person messaging.
- Added more specific services and pricing thresholds from the public offer/cennik pages.

### `profit-biuro-rachunkowe`
- Reframed around Dorota Kaszyńska based on public footer/business details.
- Kept pricing more generic at the top level while preserving the old pricing-table logic in the messaging.

### `zmarz-jolanta-biuro-rachunkowe`
- Rebuilt as solo-owner office around Jolanta Zmarz.
- Used a safer owner-led content layer because the source site is old and partially degraded.

## Verification

- `npm run lint` - PASS
- `npm run build` - PASS

## Manual review focus

- whether the shared female portrait is acceptable for all 5 solo profiles
- whether `Profit` and `Zmarz` should keep current owner naming, given weaker source quality
- whether any of the cennik blocks should be made even more conservative before broader rollout
