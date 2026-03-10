import type {
  BiuroCaseStudy,
  BiuroFaqItem,
  BiuroPricingPlan,
  BiuroProfile,
  BiuroService,
  BiuroTeamMember,
} from './biuroProfile';

const DEFAULT_LOGO_URL = '/images/logo-biuro-default.svg';

const DEFAULT_TEAM_IMAGES = [
  '/images/team-marta.jpg',
  '/images/team-anna.jpg',
  '/images/team-tomasz.jpg',
  '/images/team-piotr.jpg',
];

const DEFAULT_HERO_IMAGE = '/images/hero-accountant.jpg';

const DEFAULT_TEAM_POSITIONS = ['center 12%', 'center 12%', 'center 10%', 'center 10%'];

const DEFAULT_VALUE_PROPS = [
  'Stały opiekun i szybki kontakt roboczy',
  'Terminowe rozliczenia oraz przypomnienia terminów',
  'Wsparcie księgowe, podatkowe i kadrowe',
];

const DEFAULT_CASE_STUDIES: BiuroCaseStudy[] = [
  {
    company: 'Firma usługowa B2B',
    challenge: 'Brak przewidywalności rozliczeń i terminów podatkowych.',
    result: 'Stały harmonogram, uporządkowany obieg dokumentów i lepsza kontrola kosztów.',
  },
  {
    company: 'E-commerce',
    challenge: 'Rosnąca liczba dokumentów i ręczne procesy księgowe.',
    result: 'Szybszy obieg dokumentów, mniej błędów i stabilny proces rozliczeń.',
  },
  {
    company: 'Spółka operacyjna',
    challenge: 'Potrzeba lepszego raportowania i wsparcia podatkowego.',
    result: 'Regularne podsumowania oraz jasne rekomendacje do decyzji biznesowych.',
  },
];

const DEFAULT_FAQ: BiuroFaqItem[] = [
  {
    question: 'Ile trwa zmiana biura rachunkowego?',
    answer:
      'Najczęściej od 3 do 10 dni roboczych. Pomagamy w przekazaniu dokumentów i przejęciu obsługi.',
  },
  {
    question: 'Czy obsługa może być prowadzona online?',
    answer:
      'Tak, współpracę prowadzimy stacjonarnie, online lub hybrydowo, zależnie od potrzeb Twojej firmy.',
  },
  {
    question: 'Czy mogę mieć dedykowanego opiekuna?',
    answer:
      'Tak. Od początku wskazujemy osobę odpowiedzialną za kontakt i bieżącą koordynację rozliczeń.',
  },
  {
    question: 'Czy pomagacie we wdrożeniu KSeF?',
    answer:
      'Tak. Wspieramy przygotowanie procesu, testy oraz bieżącą pracę po uruchomieniu KSeF.',
  },
];

const SERVICE_DESCRIPTIONS: Record<string, string> = {
  'Pełna księgowość':
    'Prowadzenie ksiąg rachunkowych, sprawozdawczość i bieżące wsparcie dla spółek.',
  'KPiR i ryczałt':
    'Rozliczenia JDG i spółek cywilnych z naciskiem na przewidywalność podatków.',
  'Kadry i płace':
    'Obsługa dokumentacji pracowniczej, list płac oraz procesów kadrowych.',
  'ZUS i rozliczenia':
    'Terminowe rozliczenia ZUS i dokumenty wymagane do bieżącej działalności.',
  'Doradztwo podatkowe':
    'Wsparcie decyzyjne i podatkowe dopasowane do modelu biznesowego.',
  'KSeF i e-dokumenty':
    'Przygotowanie i obsługa procesów KSeF oraz cyfrowego obiegu dokumentów.',
  'Obsługa e-commerce':
    'Rozliczenia sprzedaży internetowej i wsparcie podatkowe dla handlu online.',
};

const COMPANY_TOKENS = [
  'biuro',
  'kancelaria',
  'sp.',
  'sp z o',
  'spółka',
  'company',
  'tax',
  'accounting',
  'office',
  'zespół',
  'zespol',
];

const NON_PERSON_IMAGE_TOKENS = [
  'logo',
  'logotyp',
  'favicon',
  'icon',
  'ikona',
  'banner',
  'invoice',
  'social',
  'linebg',
  'linebgoverlay',
  'slider',
  'slide',
  'building',
  'office',
  'biurow',
  'nieruchom',
  'real-estate',
  'wnetrz',
  'interior',
  'map',
  'googleapis',
  'placeholder',
  'tax-office',
  'svg',
];

const PERSON_IMAGE_TOKENS = [
  'team',
  'zespol',
  'zespol',
  'wlasc',
  'właśc',
  'ksiegow',
  'księgow',
  'dorad',
  'kadry',
  'anna',
  'marta',
  'piotr',
  'tomasz',
  'jan',
  'katarzyna',
  'magdalena',
  'person',
  'portrait',
  'headshot',
  'businesswoman',
  'businessman',
  'kobiet',
  'mezczyzn',
  'mężczyzn',
  'staff',
  'employee',
  'people',
];

const BROKEN_TEXT_MARKERS = ['Ã', 'Å', 'Ä', 'Ë', 'Œ', '�', '%d', '⬅'];
const LOW_QUALITY_TEXT_MARKERS = [
  'najlepszej księgowej',
  'cechy dobrej księgowej',
  'zapraszamy do',
  'kliknij',
  'sprawdź naszą ofertę',
  'sprawdz nasza oferte',
  'tel.:',
  '☎',
];

const LEGAL_SUFFIX_PATTERNS = [
  /\bsp\.?\s*z\.?\s*o\.?\s*o\.?\b/gi,
  /\bsp[oó]łka\b/gi,
  /\bspolka\b/gi,
  /\bs\.?a\.?\b/gi,
  /\bsp\.?\s*k\.?\b/gi,
  /\bsp[oó]łka\s+z\s+ograniczoną\s+odpowiedzialnością\b/gi,
  /\bspolka\s+z\s+ograniczona\s+odpowiedzialnoscia\b/gi,
];

const PRICE_RE = /(od\s*)?\d{2,6}(?:[\s.,]\d{1,3})*(?:\s*(?:zł|pln|netto|brutto))?/i;

const clean = (value: string): string => value.replace(/\s+/g, ' ').trim();

function compactToSentence(value: string, maxLength: number): string {
  const text = clean(value);
  if (!text) {
    return '';
  }
  if (text.length <= maxLength) {
    return /[.!?]$/.test(text) ? text : `${text}.`;
  }
  const sliced = text.slice(0, maxLength);
  const trimmed = sliced.includes(' ') ? sliced.slice(0, sliced.lastIndexOf(' ')) : sliced;
  return `${trimmed.replace(/[.,;:\-\s]+$/g, '')}.`;
}

function stripLegalSuffix(name: string): string {
  let text = clean(name);
  for (const pattern of LEGAL_SUFFIX_PATTERNS) {
    text = text.replace(pattern, ' ');
  }
  text = text.replace(/[()]/g, ' ');
  return clean(text).replace(/[.,\-\s]+$/g, '');
}

function looksBrokenText(raw: string): boolean {
  const text = clean(raw);
  if (!text) {
    return true;
  }

  const lowered = text.toLowerCase();
  if (BROKEN_TEXT_MARKERS.some((marker) => lowered.includes(marker.toLowerCase()))) {
    return true;
  }

  if (/https?:\/\//i.test(text) || /@[A-Za-z0-9._%+-]+/i.test(text)) {
    return true;
  }

  if (/\d{3}[\s-]?\d{3}[\s-]?\d{3}/.test(text) || /\+?48[\s-]?\d/.test(text)) {
    return true;
  }

  if (text.length < 35 || text.length > 260) {
    return true;
  }

  return LOW_QUALITY_TEXT_MARKERS.some((marker) => lowered.includes(marker));
}

function sanitizeMarketingText(raw: string, fallback: string, maxLength: number): string {
  const candidate = clean(raw)
    .replace(/https?:\/\/\S+/gi, '')
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+/g, '')
    .replace(/(?:\+?48[\s-]?)?(?:\d[\s-]?){9,11}/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  if (looksBrokenText(candidate)) {
    return compactToSentence(fallback, maxLength);
  }

  return compactToSentence(candidate, maxLength);
}

function sanitizeHeroText(raw: string, fallback: string): string {
  const normalized = sanitizeMarketingText(raw, fallback, 220);
  if (normalized.length < 90) {
    return compactToSentence(fallback, 220);
  }
  return normalized;
}

function toHttps(url: string): string {
  const candidate = clean(url);
  if (!candidate) {
    return '';
  }
  if (/^https?:\/\//i.test(candidate)) {
    return candidate.replace(/^http:\/\//i, 'https://');
  }
  if (/^[a-z0-9.-]+\.[a-z]{2,}/i.test(candidate)) {
    return `https://${candidate}`;
  }
  return candidate;
}

function isPersonLikeName(value: string): boolean {
  const text = clean(value);
  if (!text) {
    return false;
  }
  const lowered = text.toLowerCase();
  if (COMPANY_TOKENS.some((token) => lowered.includes(token))) {
    return false;
  }
  const parts = text.split(' ').filter(Boolean);
  if (parts.length < 2 || parts.length > 3) {
    return false;
  }
  return parts.every((part) => /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż\-]+$/.test(part));
}

function hashSlug(slug: string): number {
  let sum = 0;
  for (const ch of slug) {
    sum += ch.charCodeAt(0);
  }
  return sum;
}

function fallbackTeamImage(slug: string, index: number): string {
  const offset = hashSlug(slug) % DEFAULT_TEAM_IMAGES.length;
  return DEFAULT_TEAM_IMAGES[(offset + index) % DEFAULT_TEAM_IMAGES.length];
}

function isLikelyPersonImage(rawUrl: string): boolean {
  const url = clean(rawUrl).toLowerCase();
  if (!url) {
    return false;
  }

  if (url.startsWith('/images/team-')) {
    return true;
  }

  if (url.startsWith('/images/solo-')) {
    return true;
  }

  if (url.startsWith('/images/hero-accountant')) {
    return false;
  }

  if (url.endsWith('.svg')) {
    return false;
  }

  if (NON_PERSON_IMAGE_TOKENS.some((token) => url.includes(token))) {
    return false;
  }

  return PERSON_IMAGE_TOKENS.some((token) => url.includes(token));
}

function normalizeTeamType(profile: BiuroProfile, displayName: string): BiuroProfile['teamType'] {
  const explicit = profile.teamType;
  const legalName = clean(profile.legalName).toLowerCase();
  const firstMemberName = clean(profile.team?.[0]?.name || '');

  const legalSuggestsCompany =
    /sp\.?\s*z\.?\s*o\.?\s*o\.?|sp[oó]łka|spolka|s\.?a\.?|sp\.?\s*k\.?/i.test(legalName);

  if (explicit === 'jednoosobowe') {
    if (isPersonLikeName(firstMemberName) || isPersonLikeName(displayName)) {
      return 'jednoosobowe';
    }
    return legalSuggestsCompany ? 'wieloosobowe' : 'jednoosobowe';
  }

  if (explicit === 'wieloosobowe') {
    return 'wieloosobowe';
  }

  if (legalSuggestsCompany) {
    return 'wieloosobowe';
  }
  if (isPersonLikeName(displayName)) {
    return 'jednoosobowe';
  }
  return 'wieloosobowe';
}

function deriveSoloOwnerName(displayName: string): string {
  if (isPersonLikeName(displayName)) {
    return displayName;
  }
  return 'Opiekun współpracy';
}

function normalizeTeam(profile: BiuroProfile, displayName: string, teamType: BiuroProfile['teamType']): BiuroTeamMember[] {
  const sourceTeam = Array.isArray(profile.team) ? profile.team : [];
  const memberCount = teamType === 'jednoosobowe' ? 1 : Math.min(Math.max(sourceTeam.length || 3, 3), 4);
  const usedImages = new Set<string>();

  const fallbackNames = [
    teamType === 'jednoosobowe' ? deriveSoloOwnerName(displayName) : 'Opiekun klienta',
    'Specjalista ds. kadr i ZUS',
    'Doradca podatkowy',
    'Specjalista ds. KSeF',
  ];

  const fallbackRoles = [
    teamType === 'jednoosobowe' ? 'Właściciel i opiekun współpracy' : `Zespół ${displayName}`,
    'Specjalista ds. kadr i płac',
    'Ekspert podatkowy',
    'Ekspert ds. procesów cyfrowych',
  ];

  const normalized: BiuroTeamMember[] = [];

  for (let index = 0; index < memberCount; index += 1) {
    const source = sourceTeam[index] || ({} as BiuroTeamMember);
    const sourceName = clean(source.name || '');
    const sourceRole = clean(source.role || '');
    const sourceImage = clean(source.image || '');

    let chosenImage = '';
    const imageCandidates = [
      sourceImage && isLikelyPersonImage(sourceImage) ? sourceImage : '',
      profile.media?.teamCandidateUrl && isLikelyPersonImage(profile.media.teamCandidateUrl)
        ? clean(profile.media.teamCandidateUrl)
        : '',
      profile.media?.heroCandidateUrl && isLikelyPersonImage(profile.media.heroCandidateUrl)
        ? clean(profile.media.heroCandidateUrl)
        : '',
    ].filter(Boolean);

    for (const candidate of imageCandidates) {
      if (!usedImages.has(candidate)) {
        chosenImage = candidate;
        break;
      }
    }

    if (!chosenImage) {
      for (let shift = 0; shift < DEFAULT_TEAM_IMAGES.length; shift += 1) {
        const fallback = fallbackTeamImage(profile.slug, index + shift);
        if (!usedImages.has(fallback)) {
          chosenImage = fallback;
          break;
        }
      }
    }

    if (!chosenImage) {
      chosenImage = fallbackTeamImage(profile.slug, index);
    }

    usedImages.add(chosenImage);

    const safeName =
      sourceName && sourceName.length <= 60 && !/zesp[oó]ł|biuro/i.test(sourceName)
        ? sourceName
        : fallbackNames[index % fallbackNames.length];

    const safeRole =
      sourceRole && sourceRole.length <= 72
        ? compactToSentence(stripLegalSuffix(sourceRole), 72)
        : fallbackRoles[index % fallbackRoles.length];

    normalized.push({
      name: safeName,
      role: safeRole,
      experience: clean(source.experience || '') || 'Doświadczenie w obsłudze firm',
      credentials: clean(source.credentials || '') || 'Księgowość i podatki',
      image: chosenImage,
      objectPosition: clean(source.objectPosition || '')
        || resolveTeamObjectPosition(chosenImage, DEFAULT_TEAM_POSITIONS[index % DEFAULT_TEAM_POSITIONS.length]),
    });
  }

  return normalized;
}

function sanitizeServices(rawServices: BiuroService[]): BiuroService[] {
  if (!Array.isArray(rawServices) || rawServices.length === 0) {
    return [
      {
        title: 'Pełna księgowość',
        description: SERVICE_DESCRIPTIONS['Pełna księgowość'],
        priceHint: 'wycena indywidualna',
        confidence: 'medium',
      },
      {
        title: 'KPiR i ryczałt',
        description: SERVICE_DESCRIPTIONS['KPiR i ryczałt'],
        priceHint: 'wycena indywidualna',
        confidence: 'medium',
      },
      {
        title: 'Kadry i płace',
        description: SERVICE_DESCRIPTIONS['Kadry i płace'],
        priceHint: 'wycena indywidualna',
        confidence: 'medium',
      },
    ];
  }

  return rawServices.slice(0, 6).map((service) => {
    const title = clean(service.title || '') || 'Usługa księgowa';
    const mappedDescription = SERVICE_DESCRIPTIONS[title];
    const description = sanitizeMarketingText(
      service.description || '',
      mappedDescription || 'Obsługa księgowa i podatkowa dopasowana do potrzeb firmy.',
      160,
    );

    const rawPriceHint = clean(service.priceHint || '');
    const amountMatch = rawPriceHint.match(/\d{2,6}(?:[\s.,]\d{1,3})*/);
    const parsedAmount = amountMatch
      ? Number(amountMatch[0].replace(/\s+/g, '').replace(',', '.'))
      : Number.NaN;
    const hasCurrency = /zł|pln/i.test(rawPriceHint);
    const isReasonableAmount = Number.isFinite(parsedAmount) && parsedAmount >= 99;

    const priceHint = PRICE_RE.test(rawPriceHint) && isReasonableAmount
      ? compactToSentence(
          hasCurrency
            ? rawPriceHint.replace(/[.!?]+$/g, '')
            : `od ${Math.round(parsedAmount)} zł`,
          28,
        )
      : 'wycena indywidualna';

    return {
      title,
      description,
      priceHint: priceHint.replace(/\.$/, ''),
      confidence: service.confidence || 'medium',
    };
  });
}

function sanitizePricingPlans(rawPlans: BiuroPricingPlan[]): BiuroPricingPlan[] {
  if (!Array.isArray(rawPlans) || rawPlans.length === 0) {
    return [
      {
        name: 'Start',
        subtitle: 'Dla JDG i mniejszych firm',
        price: 'wycena indywidualna',
        features: ['KPiR i ryczałt', 'Kontakt mailowy i telefoniczny', 'Przypomnienia terminów'],
      },
      {
        name: 'Biznes',
        subtitle: 'Dla firm rosnących',
        price: 'wycena indywidualna',
        features: ['Kadry i płace', 'Dedykowany opiekun', 'Stałe wsparcie operacyjne'],
      },
      {
        name: 'Premium',
        subtitle: 'Dla spółek i większych zespołów',
        price: 'wycena indywidualna',
        features: ['Pełna księgowość', 'Raportowanie', 'Priorytetowe konsultacje'],
      },
    ];
  }

  return rawPlans.slice(0, 3).map((plan, idx) => {
    const fallbackName = ['Start', 'Biznes', 'Premium'][idx] || `Plan ${idx + 1}`;
    const safeFeatures = Array.isArray(plan.features)
      ? plan.features
          .map((item) => clean(item || ''))
          .filter((item) => item.length >= 4 && item.length <= 80 && !looksBrokenText(item))
          .slice(0, 4)
      : [];

    return {
      name: clean(plan.name || '') || fallbackName,
      subtitle: clean(plan.subtitle || '') || 'Pakiet usług księgowych',
      price: PRICE_RE.test(clean(plan.price || '')) ? clean(plan.price || '') : 'wycena indywidualna',
      features: safeFeatures.length > 0 ? safeFeatures : ['Zakres ustalany indywidualnie'],
    };
  });
}

function sanitizeValueProps(raw: string[]): string[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return DEFAULT_VALUE_PROPS;
  }

  const cleaned = raw
    .map((item) => clean(item || ''))
    .filter((item) => item.length >= 12 && item.length <= 90 && !looksBrokenText(item))
    .slice(0, 3);

  if (cleaned.length < 3) {
    return DEFAULT_VALUE_PROPS;
  }

  return cleaned;
}

function sanitizeCaseStudies(raw: BiuroCaseStudy[]): BiuroCaseStudy[] {
  if (!Array.isArray(raw) || raw.length < 2) {
    return DEFAULT_CASE_STUDIES;
  }

  const cleaned = raw
    .map((item) => ({
      company: clean(item.company || ''),
      challenge: sanitizeMarketingText(item.challenge || '', 'Brak przewidywalności rozliczeń i terminów.', 140),
      result: sanitizeMarketingText(item.result || '', 'Uporządkowany proces i lepsza kontrola finansowa.', 140),
    }))
    .filter((item) => item.company.length >= 6 && !looksBrokenText(item.company))
    .slice(0, 3);

  if (cleaned.length < 3) {
    return DEFAULT_CASE_STUDIES;
  }

  return cleaned;
}

function sanitizeFaq(raw: BiuroFaqItem[]): BiuroFaqItem[] {
  if (!Array.isArray(raw) || raw.length < 3) {
    return DEFAULT_FAQ;
  }

  const cleaned = raw
    .map((item) => ({
      question: clean(item.question || ''),
      answer: sanitizeMarketingText(item.answer || '', 'Zakres i harmonogram współpracy ustalamy podczas konsultacji.', 170),
    }))
    .filter((item) => item.question.length >= 8 && item.question.length <= 120)
    .slice(0, 8);

  if (cleaned.length < 4) {
    return DEFAULT_FAQ;
  }

  return cleaned;
}

function sanitizeSocial(url: string): string {
  const normalized = toHttps(url);
  if (!normalized) {
    return '';
  }
  if (!/^https:\/\//i.test(normalized)) {
    return '';
  }
  return normalized;
}

function sanitizeWebsite(profile: BiuroProfile): string {
  const normalized = toHttps(profile.website || '');
  if (normalized && /^https:\/\//i.test(normalized)) {
    return normalized;
  }

  const email = clean(profile.email || '').toLowerCase();
  if (email.includes('@')) {
    const domain = email.split('@')[1];
    if (domain && !/gmail\.com|wp\.pl|o2\.pl|interia\.pl|onet\.pl|outlook\.com/i.test(domain)) {
      return `https://${domain}`;
    }
  }

  return '';
}

function sanitizeLogoUrl(rawLogoUrl: string): string {
  return DEFAULT_LOGO_URL;
}

function resolveTeamObjectPosition(imageUrl: string, fallback: string): string {
  const lowered = clean(imageUrl || fallback).toLowerCase();

  if (lowered.includes('/images/team-anna')) {
    return 'center 12%';
  }
  if (lowered.includes('/images/team-marta')) {
    return 'center 12%';
  }
  if (lowered.includes('/images/team-tomasz')) {
    return 'center 10%';
  }
  if (lowered.includes('/images/team-piotr')) {
    return 'center 10%';
  }

  return fallback;
}

function resolveHeroImagePosition(imageUrl: string): { mobile: string; desktop: string } {
  const lowered = clean(imageUrl).toLowerCase();

  if (lowered.includes('/images/hero-accountant')) {
    return { mobile: 'center 12%', desktop: 'center 14%' };
  }

  if (lowered.includes('/images/team-anna')) {
    return { mobile: 'center 10%', desktop: 'center 12%' };
  }
  if (lowered.includes('/images/team-marta')) {
    return { mobile: 'center 10%', desktop: 'center 12%' };
  }
  if (lowered.includes('/images/team-tomasz')) {
    return { mobile: 'center 8%', desktop: 'center 10%' };
  }
  if (lowered.includes('/images/team-piotr')) {
    return { mobile: 'center 8%', desktop: 'center 10%' };
  }

  return { mobile: 'center 10%', desktop: 'center 12%' };
}

function resolveHeroImage(rawImage: string): string {
  const image = clean(rawImage);
  if (!image) {
    return DEFAULT_HERO_IMAGE;
  }

  const lowered = image.toLowerCase();
  if (lowered.startsWith('/images/team-')) {
    return image;
  }

  if (lowered.startsWith('/images/') && !lowered.endsWith('.svg')) {
    return image;
  }

  if (/^https?:\/\//i.test(lowered)) {
    return isLikelyPersonImage(image) ? toHttps(image) : DEFAULT_HERO_IMAGE;
  }

  if (NON_PERSON_IMAGE_TOKENS.some((token) => lowered.includes(token))) {
    return DEFAULT_HERO_IMAGE;
  }

  return image;
}

function buildMapEmbedUrl(address: string, city: string): string {
  const safeAddress = clean(address);
  const safeCity = clean(city);
  const query = encodeURIComponent(clean(`${safeAddress} ${safeCity}`).trim() || safeCity || 'Poznań');
  return `https://www.google.com/maps?q=${query}&output=embed`;
}

export function sanitizeBiuroProfile(profile: BiuroProfile): BiuroProfile {
  const rawDisplayName = clean(profile.displayName || profile.navName || profile.legalName || 'Biuro Rachunkowe');
  const displayName = stripLegalSuffix(rawDisplayName) || rawDisplayName;

  const navName =
    displayName.length <= 34
      ? displayName
      : `${displayName.slice(0, 34).replace(/\s+\S*$/, '').trim()}...`;

  const cityLocative = clean(profile.cityForms?.locative || profile.city || 'Twoim mieście');
  const defaultTagline = `${displayName} wspiera firmy w ${cityLocative} w księgowości, podatkach i kadrach.`;
  const defaultHeroText = `${displayName} wspiera firmy w ${cityLocative} w księgowości, podatkach i kadrach. Zapewniamy stały kontakt, terminowe rozliczenia i uporządkowany proces współpracy.`;

  const teamType = normalizeTeamType(profile, displayName);
  const team = normalizeTeam(profile, displayName, teamType);

  const heroImage = resolveHeroImage(profile.hero?.image || profile.media?.heroCandidateUrl || '');
  const heroImagePosition = resolveHeroImagePosition(heroImage);

  const services = sanitizeServices(profile.services || []);
  const pricingPlans = sanitizePricingPlans(profile.pricingPlans || []);
  const valueProps = sanitizeValueProps(profile.valueProps || []);
  const caseStudies = sanitizeCaseStudies(profile.caseStudies || []);
  const faq = sanitizeFaq(profile.faq || []);

  return {
    ...profile,
    displayName,
    navName,
    tagline: sanitizeMarketingText(profile.tagline || '', defaultTagline, 180),
    website: sanitizeWebsite(profile),
    mapUrl: buildMapEmbedUrl(profile.address || '', profile.city || ''),
    teamType,
    hero: {
      ...profile.hero,
      badge: clean(profile.hero?.badge || '') || `Biuro rachunkowe z ${cityLocative}`,
      titleTop: displayName,
      titleAccent: clean(profile.hero?.titleAccent || '') || 'Księgowość i podatki dla firm',
      text: sanitizeHeroText(profile.hero?.text || '', defaultHeroText),
      image: heroImage,
      imageFallback: '/images/hero-accountant-fallback.jpg',
      imagePositionMobile: clean(profile.hero?.imagePositionMobile || '') || heroImagePosition.mobile,
      imagePositionDesktop: clean(profile.hero?.imagePositionDesktop || '') || heroImagePosition.desktop,
      stats: Array.isArray(profile.hero?.stats) && profile.hero.stats.length > 0
        ? profile.hero.stats
        : [
            { label: 'Model pracy', value: profile.serviceModel || 'hybrydowo' },
            { label: 'Typ zespołu', value: teamType },
          ],
    },
    media: {
      ...profile.media,
      logoUrl: sanitizeLogoUrl(profile.media?.logoUrl || ''),
      heroCandidateUrl: heroImage,
      teamCandidateUrl: clean(team[0]?.image || '') || fallbackTeamImage(profile.slug, 0),
    },
    socials: {
      facebook: sanitizeSocial(profile.socials?.facebook || ''),
      instagram: sanitizeSocial(profile.socials?.instagram || ''),
      linkedin: sanitizeSocial(profile.socials?.linkedin || ''),
      youtube: sanitizeSocial(profile.socials?.youtube || ''),
    },
    services,
    pricingPlans,
    valueProps,
    caseStudies,
    faq,
    team,
  };
}
