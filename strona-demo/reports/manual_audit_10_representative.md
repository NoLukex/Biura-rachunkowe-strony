# Manual Audit 10 Representative Pages

Date: 2026-03-09
Source: existing desktop/mobile screenshots in `reports/manual_qc_screens/`, verification reports, and local smoke run (`npm run lint`, `npm run build`).

## Overall

- Technical baseline is stable: `npm run lint` and `npm run build` pass.
- The shared template is consistent and responsive across the sampled pages.
- The main remaining risk is not layout breakage but profile credibility: generic hero/team assets, overlong legal naming, and a few data-quality mismatches.

## Sampled slugs

1. `am-kancelaria-rachunkowa-sp-z-o-o`
2. `biuro-rachunkowe-atoran`
3. `biuro-rachunkowe-ekonomik`
4. `taxshield-biuro-rachunkowe-online`
5. `kancelaria-gospodarcza-szatkowscy-i-wspolnicy-sp-z-o-o`
6. `biuro-rachunkowe-income-tax-weronika-greda`
7. `biuro-rachunkowe-poznan-2`
8. `fineko-accounting-poznan`
9. `biuro-rachunkowe-gama-izabela-mitkowska`
10. `kancelaria-rachunkowa-kmn-prestige-spo-ka-z-ograniczona`

## Findings per page

### 1. `am-kancelaria-rachunkowa-sp-z-o-o`
- Verdict: strong reference page.
- Good: balanced hero, visible logo, strong hierarchy, team images load correctly, contact section reads credibly, mobile holds up.
- Note: no immediate blocker found in sampled views.

### 2. `biuro-rachunkowe-atoran`
- Verdict: good, but not fully premium yet.
- Good: clear hero, service grid reads well, CTA path is obvious.
- Risk: one team image looks washed out / placeholder-like in the sampled desktop screen, which lowers trust.

### 3. `biuro-rachunkowe-ekonomik`
- Verdict: one of the better ready pages.
- Good: fuller services section, good rhythm, team block looks complete, page feels credible.
- Note: no visible blocker in sampled desktop view.

### 4. `taxshield-biuro-rachunkowe-online`
- Verdict: ready, but visually generic.
- Good: desktop and mobile remain clean, team loads, long page sections stay readable.
- Risk: branding is still template-heavy; page needs a bit more own identity to feel less interchangeable.

### 5. `kancelaria-gospodarcza-szatkowscy-i-wspolnicy-sp-z-o-o`
- Verdict: usable, but naming and team polish still need work.
- Good: layout survives the long name on desktop, contact and pricing areas remain readable.
- Risk: hero name is very long and heavy; one team card looks faded/placeholder-like in sampled desktop.

### 6. `biuro-rachunkowe-income-tax-weronika-greda`
- Verdict: strong candidate for production set.
- Good: more human feel than most sampled pages, team block feels more believable, page reads coherently.
- Note: among the sampled pages this is one of the more convincing personalized variants.

### 7. `biuro-rachunkowe-poznan-2`
- Verdict: stable but still generic.
- Good: no visible structural breakage, section order and spacing are fine.
- Risk: sampled desktop shows the same washed-out team-card problem as a few other profiles; report also flags `phone_not_seen_on_site`.

### 8. `fineko-accounting-poznan`
- Verdict: good solo layout, not fully aligned in imagery.
- Good: the 1:1 section works well, desktop and mobile remain readable, solo structure is clear.
- Risk: profile still feels partly templated; report flags `hero_image_fallback`, so the top visual is likely not truly client-specific.

### 9. `biuro-rachunkowe-gama-izabela-mitkowska`
- Verdict: strong solo page with one clear mismatch.
- Good: the solo-owner section is convincing and the real-person photo helps a lot.
- Risk: hero image and owner image do not feel aligned; for a solo female-led office the generic male hero weakens credibility.

### 10. `kancelaria-rachunkowa-kmn-prestige-spo-ka-z-ograniczona`
- Verdict: not production-ready despite rendering correctly.
- Good: page does not visually collapse even with the long legal name; mobile remains usable.
- Risk: title is too legal/heavy, overall page still feels generic, and reports show `website_unreachable` plus `hero_image_fallback`; checklist also shows missing website/logo/team/socials/pricing.

## Cross-page patterns

- Several pages still rely on the same generic hero portrait, which makes the portfolio feel cloned.
- A few sampled team sections show pale or placeholder-looking portraits; these are trust-reducing even when the layout itself works.
- Solo-office pages work best when the owner image appears in the key visual path; `GAMA` shows why mismatch hurts.
- The design system is strong enough; the bottleneck is profile-specific asset quality and naming cleanup.

## Recommended next actions

1. Fix trust-killers first:
   - faded/placeholder-looking team cards
   - generic fallback hero images on priority pages
   - long legal names still visible in hero/nav where marketing naming should be shorter
2. Move the next review batch toward asset enrichment, not layout work:
   - logo
   - hero photo
   - team photo
   - social proof
3. Promote to production-ready shortlist first:
   - `am-kancelaria-rachunkowa-sp-z-o-o`
   - `biuro-rachunkowe-ekonomik`
   - `biuro-rachunkowe-income-tax-weronika-greda`
   - `taxshield-biuro-rachunkowe-online`
4. Hold back until fixed:
   - `kancelaria-rachunkowa-kmn-prestige-spo-ka-z-ograniczona`
   - `fineko-accounting-poznan`
   - `biuro-rachunkowe-gama-izabela-mitkowska`
   - `biuro-rachunkowe-poznan-2`
   - `biuro-rachunkowe-atoran`
   - `kancelaria-gospodarcza-szatkowscy-i-wspolnicy-sp-z-o-o`
