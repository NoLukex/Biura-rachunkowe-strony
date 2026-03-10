import { torunTrainerQuickWinOverrides } from './torunTrainerQuickWinOverrides';
import { poznanTrainerQuickWinOverrides } from './poznanTrainerQuickWinOverrides';

export type HeroMode =
  | 'default'
  | 'split-goals'
  | 'quiz'
  | 'dual-entry'
  | 'promise-packages'
  | 'single-cta'
  | 'goal-paths';

export type ContactMode = 'default' | 'qualification-3q';
export type StickyMode = 'default' | 'consult-15' | 'callback-today' | 'consult-60';

export interface QuickWinConfig {
  heroMode: HeroMode;
  contactMode: ContactMode;
  stickyMode: StickyMode;
  hideBasePricing: boolean;
  singleContactCta: boolean;
  showProgramFit: boolean;
  showPainSurvey: boolean;
  showOutcomeTriplet: boolean;
  showPricingCaseStudies: boolean;
  showSplitCaseStudies: boolean;
  showProgram90Days: boolean;
  showSeasonCalculator: boolean;
  showGoalPathsSection: boolean;
  showConsultationCalendar: boolean;
  showFirst30Days: boolean;
  showFirstTrainingSection: boolean;
  showBlogCtas: boolean;
  showBeginnerFaqIntro: boolean;
  leadMagnetFollowup: boolean;
}

const baseConfig: QuickWinConfig = {
  heroMode: 'default',
  contactMode: 'default',
  stickyMode: 'default',
  hideBasePricing: false,
  singleContactCta: false,
  showProgramFit: false,
  showPainSurvey: false,
  showOutcomeTriplet: false,
  showPricingCaseStudies: false,
  showSplitCaseStudies: false,
  showProgram90Days: false,
  showSeasonCalculator: false,
  showGoalPathsSection: false,
  showConsultationCalendar: false,
  showFirst30Days: false,
  showFirstTrainingSection: false,
  showBlogCtas: false,
  showBeginnerFaqIntro: false,
  leadMagnetFollowup: false,
};

const quickWinOverrides: Record<string, Partial<QuickWinConfig>> = {
  'arkadiusz-czajkowski-trener-personalny': {
    heroMode: 'split-goals',
  },
  'bartosz-jaszczak-trener-personalny-bydgoszcz': {
    heroMode: 'quiz',
  },
  'bartosz-trzebiatowski-trener-personalny': {
    showProgramFit: true,
  },
  'bartosz-tywusik-trener-personalny': {
    showPainSurvey: true,
  },
  'damian-piskorz': {
    heroMode: 'dual-entry',
  },
  'daria-petla-trener-personalny': {
    heroMode: 'promise-packages',
    hideBasePricing: true,
    singleContactCta: true,
  },
  'dawid-cichanski': {
    heroMode: 'single-cta',
    singleContactCta: true,
  },
  'dietetyk-bydgoszcz-tomasz-giza': {
    leadMagnetFollowup: true,
  },
  'forever-athlete-vincent-marek': {
    heroMode: 'single-cta',
    singleContactCta: true,
  },
  'jagoda-konczal-trener-personalny': {
    singleContactCta: true,
  },
  'jakub-stypczynski-trener-personalny-bydgoszcz': {
    heroMode: 'single-cta',
    stickyMode: 'consult-15',
    singleContactCta: true,
  },
  'kaja-narkun': {
    heroMode: 'single-cta',
    showOutcomeTriplet: true,
    stickyMode: 'callback-today',
  },
  'lukasz-dziennik-atletyczna-sila': {
    showPricingCaseStudies: true,
  },
  'maciej-karolczyk-trener-personalny': {
    heroMode: 'single-cta',
    contactMode: 'qualification-3q',
  },
  'maja-burek-trener-personalny': {
    heroMode: 'single-cta',
    showProgramFit: true,
  },
  'mateusz-mazur': {
    showPricingCaseStudies: true,
  },
  'mikolaj-karaszewski-fitness-lifestyle': {
    showProgram90Days: true,
  },
  'norbert-lysiak-trener-osobisty-triathlon-mtb-plywanie': {
    showSeasonCalculator: true,
    stickyMode: 'consult-60',
  },
  'oskar-kaliszewski-trener-personalny': {
    heroMode: 'goal-paths',
    showGoalPathsSection: true,
    contactMode: 'qualification-3q',
  },
  'patryk-kozikowski': {
    showConsultationCalendar: true,
    showBeginnerFaqIntro: true,
  },
  'patryk-michalek-trener-personalny': {
    showFirst30Days: true,
  },
  'trener-personalny-bydgoszcz-nicolas-marysiak': {
    contactMode: 'qualification-3q',
  },
  'trener-personalny-kamil-makowski': {
    showSplitCaseStudies: true,
  },
  'trener-personalny-szymon-idzinski': {
    heroMode: 'single-cta',
    showFirstTrainingSection: true,
  },
  'trener-radoslaw-habera': {
    showBlogCtas: true,
  },
  'wiktoria-wasik': {
    heroMode: 'promise-packages',
    hideBasePricing: true,
    singleContactCta: true,
  },
  ...(torunTrainerQuickWinOverrides as Record<string, Partial<QuickWinConfig>>),
  ...(poznanTrainerQuickWinOverrides as Record<string, Partial<QuickWinConfig>>),
};

export const getQuickWinConfig = (slug: string): QuickWinConfig => ({
  ...baseConfig,
  ...(quickWinOverrides[slug] || {}),
});
