import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { biuroProfiles } from '../src/data/biura/biuroProfiles';
import { biuroProfilesManualOverrides } from '../src/data/biura/biuroProfiles.manual';

type TeamType = 'jednoosobowe' | 'wieloosobowe' | 'nieokreslone';

type VerificationRow = {
  slug: string;
  displayName: string;
  website: string;
  teamType: TeamType;
  status: string;
};

type ServiceItem = {
  title: string;
  description: string;
  priceHint: string;
  confidence: 'high' | 'medium' | 'low';
};

type PricingPlan = {
  name: string;
  subtitle: string;
  price: string;
  features: string[];
};

type TeamCard = {
  name: string;
  role: string;
  experience: string;
  credentials: string;
  image: string;
  objectPosition: string;
};

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, '..');
const REPO_ROOT = path.resolve(ROOT, '..');
const VERIFICATION_CSV = path.join(ROOT, 'reports', 'biura_manual_verification.csv');
const MANUAL_TS = path.join(ROOT, 'src', 'data', 'biura', 'biuroProfiles.manual.ts');
const TEAM_READY_CSV = path.join(REPO_ROOT, 'Strona-trenerzy', 'data', 'poznan_biura_ready_pages_2026.csv');
const QA_REPORT_JSON = path.join(ROOT, 'reports', 'team_profiles_refresh_qa.json');
const QA_REPORT_MD = path.join(ROOT, 'reports', 'team_profiles_refresh_qa.md');

const TEAM_HERO_IMAGE = '/images/team-hero-group.jpg?v=1';
const TEAM_IMAGES = ['/images/team-marta.jpg', '/images/team-anna.jpg', '/images/team-tomasz.jpg'];
const TEAM_POSITIONS = ['center 16%', 'center 12%', 'center 10%'];

const LEGAL_SUFFIX_PATTERNS = [
  /\bsp\.?\s*z\.?\s*o\.?\s*o\.?\b/gi,
  /\bsp\.?\s*o\.?\s*o\.?\b/gi,
  /\bsp[oó]łka\b/gi,
  /\bspolka\b/gi,
  /\bs\.?a\.?\b/gi,
  /\bsp\.?\s*k\.?\b/gi,
  /\bsp[oó]łka\s+z\s+ograniczoną\s+odpowiedzialnością\b/gi,
  /\bspolka\s+z\s+ograniczona\s+odpowiedzialnoscia\b/gi,
];

const SERVICE_LIBRARY: Record<
  string,
  { description: string; group: string; phrase: string; compact: string }
> = {
  'Pełna księgowość': {
    description:
      'Prowadzimy księgi rachunkowe, sprawozdawczość oraz bieżące rozliczenia dla spółek i firm z bardziej złożonym obiegiem dokumentów.',
    group: 'pelna',
    phrase: 'pełną księgowość',
    compact: 'pełna księgowość',
  },
  'KPiR i ryczałt': {
    description:
      'Obsługujemy KPiR, ryczałt i uproszczone formy rozliczeń dla działalności gospodarczych, dbając o terminowość i porządek w dokumentach.',
    group: 'uproszczona',
    phrase: 'KPiR i ryczałt',
    compact: 'KPiR i ryczałt',
  },
  'Kadry i płace': {
    description:
      'Przygotowujemy dokumenty pracownicze, listy płac, rozliczenia ZUS oraz bieżące sprawy kadrowo-płacowe.',
    group: 'kadry',
    phrase: 'kadry i płace',
    compact: 'kadry i płace',
  },
  'ZUS i rozliczenia': {
    description:
      'Dbamy o rozliczenia ZUS, deklaracje i dokumenty potrzebne do sprawnego prowadzenia działalności.',
    group: 'zus',
    phrase: 'rozliczenia ZUS i bieżące formalności',
    compact: 'ZUS i rozliczenia',
  },
  'Doradztwo podatkowe': {
    description:
      'Wspieramy klientów w decyzjach podatkowych, planowaniu rozliczeń i bieżącej interpretacji zmian w przepisach.',
    group: 'podatki',
    phrase: 'doradztwo podatkowe',
    compact: 'podatki i doradztwo',
  },
  'KSeF i e-dokumenty': {
    description:
      'Pomagamy we wdrożeniu KSeF, elektronicznym obiegu dokumentów i uporządkowaniu procesów księgowych.',
    group: 'ksef',
    phrase: 'KSeF i e-dokumenty',
    compact: 'KSeF i e-dokumenty',
  },
  'Obsługa e-commerce': {
    description:
      'Rozliczamy sprzedaż internetową, platformy marketplace i procesy księgowe typowe dla e-commerce.',
    group: 'ecommerce',
    phrase: 'obsługę e-commerce',
    compact: 'e-commerce',
  },
  'Zakładanie firm': {
    description:
      'Pomagamy przy zakładaniu działalności, wyborze formy opodatkowania i przygotowaniu pierwszych formalności.',
    group: 'start',
    phrase: 'wsparcie przy zakładaniu firm',
    compact: 'zakładanie firm',
  },
  'Sprawozdania i raportowanie': {
    description:
      'Przygotowujemy sprawozdania, zestawienia i raporty potrzebne do lepszej kontroli finansów firmy.',
    group: 'raporty',
    phrase: 'sprawozdania i raportowanie',
    compact: 'raportowanie',
  },
};

const SERVICE_PRIORITY = [
  'Pełna księgowość',
  'KPiR i ryczałt',
  'Kadry i płace',
  'ZUS i rozliczenia',
  'Doradztwo podatkowe',
  'KSeF i e-dokumenty',
  'Obsługa e-commerce',
  'Zakładanie firm',
  'Sprawozdania i raportowanie',
];

const PRICE_BAD_TOKENS = ['1992', '1993', '1996', '2000', '2006', '2011', '2012', '2014', '2019', '2020', '2021', '2023', '2026'];

function clean(value: unknown): string {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function compactSentence(value: string, maxLength = 190): string {
  const text = clean(value).replace(/[;:]+/g, ',');
  if (!text) {
    return '';
  }

  const normalized = /[.!?]$/.test(text) ? text : `${text}.`;
  if (normalized.length <= maxLength) {
    return normalized;
  }

  const sliced = normalized.slice(0, maxLength);
  const trimmed = sliced.includes(' ') ? sliced.slice(0, sliced.lastIndexOf(' ')) : sliced;
  return `${trimmed.replace(/[.,\s-]+$/g, '')}.`;
}

function stripLegalSuffix(name: string): string {
  let text = clean(name);
  for (const pattern of LEGAL_SUFFIX_PATTERNS) {
    text = text.replace(pattern, ' ');
  }

  return clean(text)
    .replace(/[()]/g, ' ')
    .replace(/\bsp\.?$/i, '')
    .replace(/[.,\s-]+$/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function buildNavName(displayName: string): string {
  const text = clean(displayName);
  if (text.length <= 28) {
    return text;
  }

  const sliced = text.slice(0, 28);
  const trimmed = sliced.includes(' ') ? sliced.slice(0, sliced.lastIndexOf(' ')) : sliced;
  return `${trimmed}...`;
}

function parseCsv(raw: string): string[][] {
  const rows: string[][] = [];
  let current = '';
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < raw.length; i += 1) {
    const c = raw[i];
    const next = raw[i + 1];

    if (c === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && c === ',') {
      row.push(current);
      current = '';
      continue;
    }

    if (!inQuotes && (c === '\n' || c === '\r')) {
      if (c === '\r' && next === '\n') {
        i += 1;
      }
      if (row.length > 0 || current.length > 0) {
        row.push(current);
        rows.push(row);
      }
      row = [];
      current = '';
      continue;
    }

    current += c;
  }

  if (row.length > 0 || current.length > 0) {
    row.push(current);
    rows.push(row);
  }

  return rows;
}

function readVerificationRows(): VerificationRow[] {
  const raw = fs.readFileSync(VERIFICATION_CSV, 'utf8');
  const [headers, ...records] = parseCsv(raw);
  const keys = headers.map((header) => clean(header));
  return records.map((record) => {
    const row = Object.fromEntries(keys.map((key, index) => [key, clean(record[index] || '')]));
    return {
      slug: row.slug,
      displayName: row.displayName,
      website: row.website,
      teamType: (row.teamType || 'nieokreslone') as TeamType,
      status: row.status,
    };
  });
}

function safeProfile(slug: string) {
  const profile = biuroProfiles[slug];
  if (!profile) {
    throw new Error(`Missing profile for slug: ${slug}`);
  }
  return profile;
}

function normalizeTitle(title: string): string {
  const text = clean(title)
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();

  if (SERVICE_LIBRARY[text]) {
    return text;
  }

  const lowered = text.toLowerCase();
  if (lowered.includes('pełna') || lowered.includes('księgi rachunk')) {
    return 'Pełna księgowość';
  }
  if (lowered.includes('kpir') || lowered.includes('ryczałt') || lowered.includes('uproszcz')) {
    return 'KPiR i ryczałt';
  }
  if (lowered.includes('kadry') || lowered.includes('płac')) {
    return 'Kadry i płace';
  }
  if (lowered.includes('zus')) {
    return 'ZUS i rozliczenia';
  }
  if (lowered.includes('podatk')) {
    return 'Doradztwo podatkowe';
  }
  if (lowered.includes('ksef') || lowered.includes('e-dok') || lowered.includes('dokument')) {
    return 'KSeF i e-dokumenty';
  }
  if (lowered.includes('e-commerce') || lowered.includes('marketplace') || lowered.includes('sklep internet')) {
    return 'Obsługa e-commerce';
  }
  if (lowered.includes('zakład') || lowered.includes('rejestrac') || lowered.includes('start firmy')) {
    return 'Zakładanie firm';
  }
  if (lowered.includes('sprawoz') || lowered.includes('raport')) {
    return 'Sprawozdania i raportowanie';
  }

  return text;
}

function extractServiceTitles(profile: ReturnType<typeof safeProfile>): string[] {
  const pool = new Set<string>();
  const textBlob = [profile.tagline, profile.hero.text, ...profile.valueProps, ...profile.workflow]
    .join(' ')
    .toLowerCase();

  for (const service of profile.services || []) {
    const normalized = normalizeTitle(service.title);
    if (SERVICE_LIBRARY[normalized]) {
      pool.add(normalized);
    }
  }

  for (const plan of profile.pricingPlans || []) {
    for (const feature of plan.features || []) {
      const normalized = normalizeTitle(feature);
      if (SERVICE_LIBRARY[normalized]) {
        pool.add(normalized);
      }
    }
  }

  const keywordMap: Array<[string, string]> = [
    ['księgi rachunk', 'Pełna księgowość'],
    ['pełna księgowość', 'Pełna księgowość'],
    ['kpir', 'KPiR i ryczałt'],
    ['ryczałt', 'KPiR i ryczałt'],
    ['kadry', 'Kadry i płace'],
    ['płac', 'Kadry i płace'],
    ['zus', 'ZUS i rozliczenia'],
    ['podat', 'Doradztwo podatkowe'],
    ['ksef', 'KSeF i e-dokumenty'],
    ['e-commerce', 'Obsługa e-commerce'],
    ['sklep internet', 'Obsługa e-commerce'],
    ['zakładanie firmy', 'Zakładanie firm'],
    ['rejestracj', 'Zakładanie firm'],
    ['sprawozd', 'Sprawozdania i raportowanie'],
    ['raport', 'Sprawozdania i raportowanie'],
  ];

  for (const [keyword, title] of keywordMap) {
    if (textBlob.includes(keyword)) {
      pool.add(title);
    }
  }

  const ordered = SERVICE_PRIORITY.filter((title) => pool.has(title));
  if (ordered.length === 0) {
    return ['KPiR i ryczałt', 'Kadry i płace', 'Doradztwo podatkowe'];
  }
  if (ordered.length === 1) {
    if (ordered[0] !== 'Kadry i płace') ordered.push('Kadry i płace');
    if (!ordered.includes('Doradztwo podatkowe')) ordered.push('Doradztwo podatkowe');
  }
  if (ordered.length === 2) {
    if (!ordered.includes('Doradztwo podatkowe')) {
      ordered.push('Doradztwo podatkowe');
    } else {
      ordered.push('ZUS i rozliczenia');
    }
  }
  return ordered.slice(0, 4);
}

function buildServices(serviceTitles: string[]): ServiceItem[] {
  return serviceTitles.slice(0, 3).map((title, index) => ({
    title,
    description: SERVICE_LIBRARY[title]?.description || 'Prowadzimy obsługę księgową dopasowaną do potrzeb firmy i skali dokumentów.',
    priceHint: index === 0 ? 'wycena indywidualna' : 'zakres ustalany indywidualnie',
    confidence: index === 0 ? 'high' : 'medium',
  }));
}

function normalizePrice(price: string): string {
  const text = clean(price).toLowerCase();
  if (!text || text.includes('wycena')) {
    return 'wycena indywidualna';
  }
  if (PRICE_BAD_TOKENS.some((token) => text.includes(token))) {
    return 'wycena indywidualna';
  }
  const match = text.match(/(?:od\s*)?\d{2,4}(?:[\s.,]\d{1,3})?(?:\s*(?:zł|pln))?/i);
  if (!match) {
    return 'wycena indywidualna';
  }
  const digits = match[0].replace(/\D/g, '');
  const amount = Number(digits);
  if (Number.isFinite(amount) && amount >= 1900 && amount <= 2099) {
    return 'wycena indywidualna';
  }
  let normalized = match[0]
    .replace(/pln/gi, 'zł')
    .replace(/\s+/g, ' ')
    .trim();
  if (!/zł/i.test(normalized)) {
    normalized = `${normalized} zł`;
  }
  return `${normalized.replace(/\s*\/\s*mies\.?$/i, '')} / mies.`;
}

function pickPlanPrice(profile: ReturnType<typeof safeProfile>, index: number): string {
  const candidate = profile.pricingPlans?.[index]?.price || profile.services?.[index]?.priceHint || '';
  return normalizePrice(candidate);
}

function modelLabel(serviceModel: string): string {
  if (serviceModel === 'online') {
    return 'online';
  }
  if (serviceModel === 'hybrydowo') {
    return 'hybrydowo';
  }
  if (serviceModel === 'stacjonarnie') {
    return 'stacjonarnie';
  }
  return 'dopasowany do potrzeb firmy';
}

function modelCapability(serviceModel: string): string {
  if (serviceModel === 'online') {
    return 'Współpraca online i sprawna wymiana dokumentów';
  }
  if (serviceModel === 'hybrydowo') {
    return 'Współpraca hybrydowa, łącząca kontakt zdalny i spotkania';
  }
  if (serviceModel === 'stacjonarnie') {
    return 'Kontakt stacjonarny z możliwością bieżących ustaleń zdalnych';
  }
  return 'Model współpracy dopasowany do sposobu pracy klienta';
}

function buildServicePhrase(serviceTitles: string[]): string {
  const titles = serviceTitles.slice(0, 3).map((title) => SERVICE_LIBRARY[title]?.phrase || title.toLowerCase());
  if (titles.length === 1) {
    return titles[0];
  }
  if (titles.length === 2) {
    return `${titles[0]} oraz ${titles[1]}`;
  }
  return `${titles[0]}, ${titles[1]} i ${titles[2]}`;
}

function buildStatsScope(serviceTitles: string[]): string {
  const titles = serviceTitles.slice(0, 3).map((title) => SERVICE_LIBRARY[title]?.compact || title);
  if (titles.length === 1) {
    return titles[0];
  }
  if (titles.length === 2) {
    return `${titles[0]} oraz ${titles[1]}`;
  }
  return `${titles[0]}, ${titles[1]} i ${titles[2]}`;
}

function buildScope(serviceTitles: string[]): { label: string; locative: string; accusative: string } {
  const hasFull = serviceTitles.includes('Pełna księgowość');
  const hasKpir = serviceTitles.includes('KPiR i ryczałt');
  const hasPayroll = serviceTitles.includes('Kadry i płace');
  const hasTax = serviceTitles.includes('Doradztwo podatkowe') || serviceTitles.includes('ZUS i rozliczenia');
  const hasKsef = serviceTitles.includes('KSeF i e-dokumenty');
  const hasEcommerce = serviceTitles.includes('Obsługa e-commerce');
  const hasStart = serviceTitles.includes('Zakładanie firm');

  if (hasEcommerce) {
    return {
      label: 'księgowość, podatki i e-commerce',
      locative: 'księgowości, podatkach i rozliczeniach e-commerce',
      accusative: 'księgowość, podatki i rozliczenia e-commerce',
    };
  }
  if (hasKsef) {
    return {
      label: 'księgowość, podatki i KSeF',
      locative: 'księgowości, podatkach i wdrożeniu KSeF',
      accusative: 'księgowość, podatki i procesy KSeF',
    };
  }
  if (hasFull && hasPayroll) {
    return {
      label: 'pełna księgowość, kadry i podatki',
      locative: 'pełnej księgowości, kadrach i podatkach',
      accusative: 'pełną księgowość, kadry i podatki',
    };
  }
  if (hasFull && hasTax) {
    return {
      label: 'pełna księgowość i podatki',
      locative: 'pełnej księgowości i podatkach',
      accusative: 'pełną księgowość i podatki',
    };
  }
  if (hasKpir && hasPayroll) {
    return {
      label: 'KPiR, kadry i podatki',
      locative: 'KPiR, kadrach i bieżących rozliczeniach',
      accusative: 'KPiR, kadry i bieżące rozliczenia',
    };
  }
  if (hasPayroll) {
    return {
      label: 'księgowość, kadry i rozliczenia',
      locative: 'księgowości, kadrach i bieżących rozliczeniach',
      accusative: 'księgowość, kadry i bieżące rozliczenia',
    };
  }
  if (hasStart) {
    return {
      label: 'księgowość i wsparcie przy starcie firmy',
      locative: 'księgowości i wsparciu przy starcie firmy',
      accusative: 'księgowość i wsparcie przy starcie firmy',
    };
  }

  return {
    label: 'księgowość, podatki i bieżąca obsługa',
    locative: 'księgowości, podatkach i bieżącej obsłudze firm',
    accusative: 'księgowość, podatki i bieżącą obsługę firm',
  };
}

function buildTitleAccent(serviceTitles: string[]): string {
  if (serviceTitles.includes('Obsługa e-commerce')) {
    return 'Zespół księgowy dla firm i e-commerce';
  }
  if (serviceTitles.includes('KSeF i e-dokumenty')) {
    return 'Księgowość, podatki i cyfrowy obieg dokumentów';
  }
  if (serviceTitles.includes('Pełna księgowość')) {
    return 'Zespół księgowy dla firm i spółek';
  }
  return 'Księgowość, podatki i obsługa firm';
}

function buildTagline(serviceTitles: string[]): string {
  const scope = buildScope(serviceTitles);
  return compactSentence(
    `Wspieramy firmy w ${scope.locative}, zapewniając stały kontakt, terminowe rozliczenia i współpracę dopasowaną do skali działalności.`,
    180,
  );
}

function buildHeroText(serviceTitles: string[], serviceModel: string): string {
  const scope = buildScope(serviceTitles);
  const addOn = serviceTitles.includes('Zakładanie firm')
    ? 'Pomagamy zarówno przy bieżącej obsłudze, jak i przy starcie nowych działalności.'
    : serviceTitles.includes('Obsługa e-commerce')
      ? 'Dopasowujemy proces rozliczeń do sklepów internetowych, marketplace i rosnącej liczby dokumentów.'
      : serviceTitles.includes('KSeF i e-dokumenty')
        ? 'Porządkujemy także obieg dokumentów i procesy związane z KSeF.'
        : 'Dopasowujemy zakres współpracy do liczby dokumentów, pracowników i tempa rozwoju firmy.';

  return compactSentence(
    `Nasz zespół prowadzi ${scope.accusative} dla firm, które oczekują sprawnej komunikacji, uporządkowanego obiegu dokumentów i wsparcia dopasowanego do realnych potrzeb biznesu. ${addOn}`,
    220,
  );
}

function buildValueProps(serviceTitles: string[], serviceModel: string): string[] {
  const scope = buildScope(serviceTitles);
  const props = [
    modelCapability(serviceModel),
    `Zespół odpowiedzialny za obszar: ${scope.label}`,
    'Terminowe rozliczenia i uporządkowany obieg dokumentów',
  ];

  if (serviceTitles.includes('Obsługa e-commerce')) {
    props[1] = 'Rozliczenia dopasowane do e-commerce, sprzedaży online i rosnącej skali dokumentów';
  } else if (serviceTitles.includes('KSeF i e-dokumenty')) {
    props[1] = 'Wsparcie przy KSeF, e-dokumentach i porządkowaniu procesów księgowych';
  }

  return props;
}

function buildWorkflow(serviceTitles: string[]): string[] {
  const stepTwo = serviceTitles.includes('KSeF i e-dokumenty')
    ? 'Ustalamy obieg dokumentów, komunikację i proces pracy z KSeF lub e-dokumentami'
    : 'Ustalamy zakres obsługi, osoby kontaktowe oraz wygodny sposób przekazywania dokumentów';

  const stepThree = serviceTitles.includes('Sprawozdania i raportowanie')
    ? 'Prowadzimy bieżące rozliczenia, raportowanie i stały kontakt z klientem'
    : 'Prowadzimy bieżące rozliczenia, przypominamy o terminach i reagujemy na bieżące potrzeby firmy';

  return [
    'Zaczynamy od krótkiej rozmowy i poznania modelu działalności oraz potrzeb księgowych',
    stepTwo,
    stepThree,
  ];
}

function planFeaturesStart(serviceTitles: string[]): string[] {
  const features = [
    serviceTitles.includes('KPiR i ryczałt') ? 'KPiR, ryczałt i podstawowe rozliczenia podatkowe' : 'Bieżąca księgowość i podstawowe rozliczenia firmy',
    'Stały kontakt mailowy i telefoniczny z zespołem',
    'Przypomnienia terminów i uporządkowany obieg dokumentów',
    serviceTitles.includes('Zakładanie firm') ? 'Wsparcie przy starcie działalności i wyborze formy rozliczeń' : 'Zakres dopasowany do skali dokumentów i potrzeb firmy',
  ];
  return features;
}

function planFeaturesBusiness(serviceTitles: string[]): string[] {
  const middle = serviceTitles.includes('Kadry i płace')
    ? 'Kadry, płace i bieżąca obsługa spraw pracowniczych'
    : serviceTitles.includes('Pełna księgowość')
      ? 'Pełniejsza obsługa księgowa dla firm z większym obiegiem dokumentów'
      : 'Rozliczenia podatkowe i szersza obsługa dokumentów firmowych';
  const closing = serviceTitles.includes('Obsługa e-commerce')
    ? 'Dopasowanie procesu do sprzedaży online i wielu kanałów sprzedaży'
    : 'Koordynacja współpracy i szybki kontakt przy bieżących sprawach';

  return [
    middle,
    'Wsparcie w VAT, ZUS i codziennych rozliczeniach',
    closing,
    'Model obsługi dostosowany do tempa pracy firmy',
  ];
}

function planFeaturesPremium(serviceTitles: string[]): string[] {
  const first = serviceTitles.includes('Pełna księgowość')
    ? 'Pełna księgowość, sprawozdawczość i szersza obsługa spółek'
    : 'Rozszerzona obsługa księgowa dla firm z bardziej złożonym zakresem';
  const second = serviceTitles.includes('Doradztwo podatkowe')
    ? 'Wsparcie podatkowe i konsultacje przy ważniejszych decyzjach'
    : 'Stałe wsparcie przy bardziej złożonych procesach finansowych';
  const third = serviceTitles.includes('Sprawozdania i raportowanie')
    ? 'Raporty, podsumowania i szersza kontrola nad finansami firmy'
    : 'Priorytetowy kontakt i zakres ustalany po analizie potrzeb';

  return [first, second, third, 'Wycena po poznaniu skali dokumentów, procesów i oczekiwań klienta'];
}

function buildPricingPlans(profile: ReturnType<typeof safeProfile>, serviceTitles: string[]): PricingPlan[] {
  return [
    {
      name: 'Start',
      subtitle: 'Dla JDG i małych firm oczekujących sprawnej bieżącej obsługi',
      price: pickPlanPrice(profile, 0),
      features: planFeaturesStart(serviceTitles),
    },
    {
      name: 'Biznes',
      subtitle: 'Dla firm z większą liczbą dokumentów, pracownikami lub szerszym zakresem',
      price: pickPlanPrice(profile, 1),
      features: planFeaturesBusiness(serviceTitles),
    },
    {
      name: 'Premium',
      subtitle: 'Dla spółek i organizacji potrzebujących bardziej rozbudowanej obsługi',
      price: pickPlanPrice(profile, 2),
      features: planFeaturesPremium(serviceTitles),
    },
  ].map((plan, index) => ({
    ...plan,
    price: index === 2 && plan.price === 'wycena indywidualna' ? 'wycena indywidualna' : plan.price,
  }));
}

function buildTeam(shortName: string, serviceTitles: string[]): TeamCard[] {
  const scope = buildScope(serviceTitles);
  const secondRole = serviceTitles.includes('Kadry i płace')
    ? {
        name: 'Kadry i płace',
        role: 'Obsługa spraw pracowniczych i rozliczeń ZUS',
        experience: 'Bieżąca dokumentacja pracownicza, listy płac i formalności kadrowe',
        credentials: 'Kadry, płace i ZUS',
      }
    : {
        name: 'Księgowość operacyjna',
        role: 'Bieżąca obsługa dokumentów i rozliczeń',
        experience: 'Codzienna księgowość, ewidencje i kontakt roboczy z klientem',
        credentials: 'Księgowość, VAT i rozliczenia',
      };

  const thirdRole = serviceTitles.includes('Doradztwo podatkowe')
    ? {
        name: 'Podatki i sprawozdawczość',
        role: 'Wsparcie przy podatkach, deklaracjach i raportowaniu',
        experience: 'Pomoc w interpretacji zmian, zamknięciach okresów i ważniejszych decyzjach',
        credentials: 'Podatki, sprawozdania i konsultacje',
      }
    : serviceTitles.includes('KSeF i e-dokumenty')
      ? {
          name: 'Procesy i e-dokumenty',
          role: 'Organizacja obiegu dokumentów i pracy z KSeF',
          experience: 'Porządkowanie procesów księgowych i cyfrowego przekazywania dokumentów',
          credentials: 'KSeF, e-dokumenty i workflow',
        }
      : {
          name: 'Podatki i rozwój współpracy',
          role: 'Koordynacja szerszego zakresu obsługi firmy',
          experience: 'Wsparcie przy bardziej złożonych sprawach i rozwoju współpracy',
          credentials: 'Podatki, raportowanie i proces obsługi',
        };

  return [
    {
      name: 'Koordynacja współpracy',
      role: `Zespół ${shortName}`,
      experience: 'Stały kontakt z klientem, organizacja obiegu dokumentów i ustaleń roboczych',
      credentials: `Obsługa: ${scope.label}`,
      image: TEAM_IMAGES[0],
      objectPosition: TEAM_POSITIONS[0],
    },
    {
      ...secondRole,
      image: TEAM_IMAGES[1],
      objectPosition: TEAM_POSITIONS[1],
    },
    {
      ...thirdRole,
      image: TEAM_IMAGES[2],
      objectPosition: TEAM_POSITIONS[2],
    },
  ];
}

function buildOverride(row: VerificationRow) {
  const profile = safeProfile(row.slug);
  const rawDisplayName = clean(row.displayName || profile.displayName || profile.legalName || row.slug);
  const shortName = stripLegalSuffix(rawDisplayName) || rawDisplayName;
  const serviceTitles = extractServiceTitles(profile);
  const displayName = compactSentence(shortName, 52).replace(/[.!?]$/, '');
  const scope = buildScope(serviceTitles);

  const override = {
    displayName,
    navName: buildNavName(displayName),
    tagline: buildTagline(serviceTitles),
    hero: {
      titleTop: displayName,
      titleAccent: buildTitleAccent(serviceTitles),
      text: buildHeroText(serviceTitles, profile.serviceModel),
      image: TEAM_HERO_IMAGE,
      imagePositionMobile: 'center 24%',
      imagePositionDesktop: 'center 24%',
      stats: [
        {
          label: 'Model współpracy',
          value: modelLabel(profile.serviceModel),
        },
        {
          label: 'Zakres obsługi',
          value: scope.label,
        },
      ],
    },
    media: {
      logoUrl: clean(profile.media.logoUrl),
      heroCandidateUrl: TEAM_HERO_IMAGE,
      teamCandidateUrl: TEAM_IMAGES[0],
    },
    valueProps: buildValueProps(serviceTitles, profile.serviceModel),
    workflow: buildWorkflow(serviceTitles),
    pricingPlans: buildPricingPlans(profile, serviceTitles),
    services: buildServices(serviceTitles),
    team: buildTeam(displayName, serviceTitles),
  };

  return override;
}

function writeManualOverrides(nextOverrides: Record<string, unknown>): void {
  const ordered = Object.keys(nextOverrides)
    .sort((a, b) => a.localeCompare(b))
    .reduce<Record<string, unknown>>((acc, key) => {
      acc[key] = nextOverrides[key];
      return acc;
    }, {});

  const output = `import type { BiuroProfileOverride } from './biuroProfile';\n\nexport const biuroProfilesManualOverrides: Record<string, BiuroProfileOverride> = ${JSON.stringify(ordered, null, 2)};\n`;
  fs.writeFileSync(MANUAL_TS, output, 'utf8');
}

function csvEscape(value: string): string {
  const text = clean(value);
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function writeReadyCsv(rows: VerificationRow[]): void {
  const lines = ['slug,displayName,website,status'];
  for (const row of rows.slice().sort((a, b) => a.slug.localeCompare(b.slug))) {
    lines.push([row.slug, row.displayName, row.website, 'ready'].map(csvEscape).join(','));
  }
  fs.writeFileSync(TEAM_READY_CSV, `${lines.join('\n')}\n`, 'utf8');
}

function buildQa(rows: VerificationRow[], overrides: Record<string, unknown>) {
  const issuesBySlug: Record<string, string[]> = {};

  for (const row of rows) {
    const override = overrides[row.slug] as any;
    const issues: string[] = [];
    const heroText = clean(override?.hero?.text);
    const tagline = clean(override?.tagline);
    const displayName = clean(override?.displayName);
    const heroImage = clean(override?.hero?.image);
    const team = Array.isArray(override?.team) ? override.team : [];
    const prices = Array.isArray(override?.pricingPlans) ? override.pricingPlans.map((plan: any) => clean(plan.price)) : [];

    if (!heroImage.includes('team-hero-group')) {
      issues.push('hero_image_not_team_default');
    }
    if (/\b(prowadzę|wspieram|pomagam|zajmuję się)\b/i.test(heroText) || /\b(prowadzę|wspieram|pomagam|zajmuję się)\b/i.test(tagline)) {
      issues.push('singular_voice_found');
    }
    if (!/(wspieramy|prowadzimy|zapewniamy|pomagamy|nasz zespół)/i.test(heroText)) {
      issues.push('team_voice_missing');
    }
    if (/[ÃÅÄËŒ�]/.test(`${displayName} ${tagline} ${heroText}`)) {
      issues.push('encoding_issue');
    }
    if (!displayName || displayName.length > 52) {
      issues.push('display_name_length');
    }
    if (team.length !== 3) {
      issues.push('team_count_not_three');
    }
    if (new Set(team.map((item: any) => clean(item.image))).size !== team.length) {
      issues.push('team_images_not_unique');
    }
    if (prices.some((price) => PRICE_BAD_TOKENS.some((token) => price.includes(token)))) {
      issues.push('bad_price_token');
    }

    issuesBySlug[row.slug] = issues;
  }

  fs.writeFileSync(QA_REPORT_JSON, JSON.stringify(issuesBySlug, null, 2), 'utf8');

  const issueEntries = Object.entries(issuesBySlug);
  const passCount = issueEntries.filter(([, issues]) => issues.length === 0).length;
  const warnEntries = issueEntries.filter(([, issues]) => issues.length > 0);
  const lines = [
    '# Team Profiles Refresh QA',
    '',
    `- Checked profiles: **${rows.length}**`,
    `- PASS: **${passCount}**`,
    `- WARN: **${warnEntries.length}**`,
    '',
    '## Results',
  ];

  for (const [slug, issues] of issueEntries.sort((a, b) => a[0].localeCompare(b[0]))) {
    lines.push(`- \`${slug}\` - ${issues.length === 0 ? 'PASS' : `WARN (${issues.join(', ')})`}`);
  }

  fs.writeFileSync(QA_REPORT_MD, `${lines.join('\n')}\n`, 'utf8');
  return { passCount, warnCount: warnEntries.length, issuesBySlug };
}

function main(): void {
  const verificationRows = readVerificationRows();
  const nonSoloRows = verificationRows.filter((row) => row.teamType !== 'jednoosobowe');

  const nextOverrides: Record<string, unknown> = { ...biuroProfilesManualOverrides };
  for (const row of nonSoloRows) {
    nextOverrides[row.slug] = buildOverride(row);
  }

  writeManualOverrides(nextOverrides);
  writeReadyCsv(verificationRows);
  const qa = buildQa(nonSoloRows, nextOverrides);

  console.log(`Updated non-solo profiles: ${nonSoloRows.length}`);
  console.log(`PASS=${qa.passCount} WARN=${qa.warnCount}`);
  console.log(`Manual overrides: ${MANUAL_TS}`);
  console.log(`Ready CSV: ${TEAM_READY_CSV}`);
  console.log(`QA JSON: ${QA_REPORT_JSON}`);
  console.log(`QA MD: ${QA_REPORT_MD}`);
}

main();
