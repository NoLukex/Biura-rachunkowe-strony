export interface TrainerTheme {
  accent: string;
  accentDark: string;
  accentSoft: string;
  bg: string;
  bgSoft: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  textMuted: string;
}

export interface TrainerFeatureItem {
  title: string;
  desc: string;
}

export interface TrainerPricingPlan {
  name: string;
  subtitle: string;
  price: string;
  period: string;
  features: string[];
  ctaLabel: string;
  featured?: boolean;
}

export interface TrainerFaqItem {
  q: string;
  a: string;
}

export interface TrainerProfile {
  slug: string;
  fullName: string;
  brandName: string;
  navName: string;
  brandTagline: string;
  city: string;
  address: string;
  category: string;
  phone: string;
  email: string;
  website: string;
  instagram: string;
  facebook: string;
  rating: number;
  heroTitleTop: string;
  heroTitleAccent: string;
  heroText: string;
  aboutHeading: string;
  aboutText: string;
  nicheLabel?: string;
  quickWin?: string;
  researchCue?: string;
  researchSource?: string;
  researchConfidence?: string;
  valueProps?: TrainerFeatureItem[];
  pricingPlans?: TrainerPricingPlan[];
  faqItems?: TrainerFaqItem[];
  leadMagnetTitle?: string;
  leadMagnetText?: string;
  theme: TrainerTheme;
}
