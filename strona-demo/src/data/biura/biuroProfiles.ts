import { biuroProfilesGenerated, defaultBiuroSlug } from './biuroProfiles.generated';
import { biuroProfilesManualOverrides } from './biuroProfiles.manual';
import type { BiuroProfile, BiuroProfileOverride } from './biuroProfile';
import { sanitizeBiuroProfile } from './sanitizeBiuroProfile';

function mergeProfile(base: BiuroProfile, override?: BiuroProfileOverride): BiuroProfile {
  if (!override) {
    return base;
  }

  const overrideHero = (override.hero || {}) as Partial<BiuroProfile['hero']>;
  const overrideResearch = (override.research || {}) as Partial<BiuroProfile['research']>;
  const overrideResearchFields =
    (overrideResearch.fields || {}) as Partial<BiuroProfile['research']['fields']>;

  return {
    ...base,
    ...override,
    cityForms: {
      ...base.cityForms,
      ...(override.cityForms || {}),
    },
    socials: {
      ...base.socials,
      ...(override.socials || {}),
    },
    hero: {
      ...base.hero,
      ...overrideHero,
      stats: (overrideHero.stats as BiuroProfile['hero']['stats']) || base.hero.stats,
    },
    media: {
      ...base.media,
      ...(override.media || {}),
    },
    research: {
      ...base.research,
      ...overrideResearch,
      fields: {
        ...base.research.fields,
        ...overrideResearchFields,
      },
      notes: (overrideResearch.notes as BiuroProfile['research']['notes']) || base.research.notes,
      sources: (overrideResearch.sources as BiuroProfile['research']['sources']) || base.research.sources,
    },
    services: (override.services as BiuroProfile['services']) || base.services,
    pricingPlans: (override.pricingPlans as BiuroProfile['pricingPlans']) || base.pricingPlans,
    workflow: (override.workflow as BiuroProfile['workflow']) || base.workflow,
    valueProps: (override.valueProps as BiuroProfile['valueProps']) || base.valueProps,
    caseStudies: (override.caseStudies as BiuroProfile['caseStudies']) || base.caseStudies,
    faq: (override.faq as BiuroProfile['faq']) || base.faq,
    team: (override.team as BiuroProfile['team']) || base.team,
    emails: (override.emails as BiuroProfile['emails']) || base.emails,
  };
}

export const biuroProfiles: Record<string, BiuroProfile> = Object.entries(biuroProfilesGenerated).reduce(
  (acc, [slug, profile]) => {
    const mergedProfile = mergeProfile(profile, biuroProfilesManualOverrides[slug]);
    acc[slug] = sanitizeBiuroProfile(mergedProfile);
    return acc;
  },
  {} as Record<string, BiuroProfile>,
);

export const defaultProfileSlug = defaultBiuroSlug;
