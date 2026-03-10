export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type BiuroService = {
  title: string;
  description: string;
  priceHint: string;
  confidence: ConfidenceLevel;
};

export type BiuroPricingPlan = {
  name: string;
  subtitle: string;
  price: string;
  features: string[];
};

export type BiuroFaqItem = {
  question: string;
  answer: string;
};

export type BiuroCaseStudy = {
  company: string;
  challenge: string;
  result: string;
};

export type BiuroTeamMember = {
  name: string;
  role: string;
  experience: string;
  credentials: string;
  image: string;
  objectPosition: string;
};

export type BiuroSocials = {
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
};

export type BiuroCityForms = {
  nominative: string;
  genitive: string;
  locative: string;
};

export type BiuroHero = {
  badge: string;
  titleTop: string;
  titleAccent: string;
  text: string;
  image: string;
  imageFallback: string;
  imagePositionMobile?: string;
  imagePositionDesktop?: string;
  stats: Array<{
    label: string;
    value: string;
  }>;
};

export type BiuroResearchField = {
  value: string;
  confidence: ConfidenceLevel;
  source: string;
};

export type BiuroResearchMeta = {
  updatedAt: string;
  sources: string[];
  summaryConfidence: ConfidenceLevel;
  fields: {
    displayName: BiuroResearchField;
    services: BiuroResearchField;
    pricing: BiuroResearchField;
    teamType: BiuroResearchField;
    workModel: BiuroResearchField;
    media: BiuroResearchField;
  };
  notes: string[];
};

export type BiuroProfile = {
  slug: string;
  legalName: string;
  displayName: string;
  navName: string;
  tagline: string;
  city: string;
  cityForms: BiuroCityForms;
  address: string;
  phone: string;
  email: string;
  emails: string[];
  website: string;
  mapUrl: string;
  socials: BiuroSocials;
  teamType: 'jednoosobowe' | 'wieloosobowe' | 'nieokreslone';
  serviceModel: 'stacjonarnie' | 'online' | 'hybrydowo' | 'nieokreslone';
  hero: BiuroHero;
  services: BiuroService[];
  pricingPlans: BiuroPricingPlan[];
  workflow: string[];
  valueProps: string[];
  caseStudies: BiuroCaseStudy[];
  faq: BiuroFaqItem[];
  team: BiuroTeamMember[];
  media: {
    logoUrl: string;
    heroCandidateUrl: string;
    teamCandidateUrl: string;
  };
  research: BiuroResearchMeta;
};

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

export type BiuroProfileOverride = DeepPartial<BiuroProfile>;
