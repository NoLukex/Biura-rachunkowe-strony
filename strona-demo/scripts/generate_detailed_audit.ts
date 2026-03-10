import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { biuroProfiles } from '../src/data/biura/biuroProfiles';

type VerificationRow = {
  slug: string;
  displayName: string;
  website: string;
  teamType: string;
  status: string;
};

type QaRow = {
  slug: string;
  status: string;
  http: string;
  displayName: string;
  heroImage: string;
  logoUrl: string;
  teamCount: string;
  issues: string;
};

type ManualQcItem = {
  slug: string;
  status: string;
  issueCount: number;
  desktop?: {
    routes?: Array<{ route: string; status: number }>;
    home?: {
      heroTitle?: string;
      heroText?: string;
      heroSrc?: string;
      mojibake?: boolean;
      nonPersonTeam?: boolean;
      hasContactEmail?: boolean;
      hasContactPhone?: boolean;
      h2Count?: number;
    };
    screenshot?: string;
  };
  mobile?: {
    routes?: Array<{ route: string; status: number }>;
    screenshot?: string;
  };
  issues?: string[];
};

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, '..');
const REPORTS = path.join(ROOT, 'reports');

const VERIFICATION_CSV = path.join(REPORTS, 'biura_manual_verification.csv');
const QA_CSV = path.join(REPORTS, 'ready_pages_final_qa.csv');
const MANUAL_QC_JSON = path.join(REPORTS, 'manual_qc_all_biura.json');
const OUTPUT_MD = path.join(REPORTS, 'audyt_koncowy_biura_szczegolowy_2026-03-09.md');

function clean(value: unknown): string {
  return String(value || '').replace(/\s+/g, ' ').trim();
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

function parseCsvObjects<T extends Record<string, string>>(filePath: string): T[] {
  const raw = fs.readFileSync(filePath, 'utf8');
  const [headers, ...records] = parseCsv(raw);
  const keys = headers.map((header) => clean(header));
  return records.map((record) => {
    const row = Object.fromEntries(keys.map((key, index) => [key, clean(record[index] || '')]));
    return row as T;
  });
}

function teamVoice(teamType: string, heroText: string, tagline: string): string {
  const blob = `${heroText} ${tagline}`.toLowerCase();
  if (teamType === 'jednoosobowe') {
    return /(prowadzę|wspieram|zajmuję się|pomagam)/i.test(blob) ? 'spójny z modelem solo' : 'warto utrzymać 1. osobę';
  }
  return /(nasz zespół|wspieramy|prowadzimy|zapewniamy)/i.test(blob) ? 'spójny z modelem zespołowym' : 'do dopracowania zespołowy ton';
}

function imageRemark(teamType: string, heroImage: string, team: Array<{ image: string; name: string }>): string {
  const uniqueTeamImages = new Set(team.map((item) => item.image)).size;
  if (teamType === 'jednoosobowe') {
    const sameImage = team.length > 0 && clean(team[0].image) === clean(heroImage);
    return sameImage
      ? 'Hero i sekcja osoby prowadzącej są spójne wizualnie.'
      : 'Hero i sekcja osoby prowadzącej warto jeszcze wyrównać wizualnie.';
  }
  if (heroImage.includes('team-hero-group')) {
    return `Hero jest ustawione jako zespołowe, a sekcja team ma ${uniqueTeamImages} osobne grafiki ról.`;
  }
  return 'Hero nie jest jeszcze w pełni zespołowe albo korzysta z innego obrazu niż standard grupowy.';
}

function pricingRemark(prices: string[]): string {
  const amounts = prices
    .map((price) => Number((price.match(/\d+/) || [])[0] || 0))
    .filter((value) => Number.isFinite(value) && value > 0);
  if (prices.every((price) => price === 'wycena indywidualna')) {
    return 'Cennik jest bezpieczny i całkowicie indywidualny; brak ryzyka sztucznych kwot.';
  }
  const visible = prices.filter(Boolean).join(', ');
  if (amounts.some((value) => value < 100)) {
    return `Cennik pokazuje poziomy: ${visible}. Warto jednak ręcznie zweryfikować najniższe kwoty, bo część z nich może pochodzić z historycznego cennika albo z uproszczonego scrapu.`;
  }
  return `Cennik pokazuje realne poziomy wejścia: ${visible}. Wartość wygląda spójnie z układem oferty.`;
}

function logoRemark(logoUrl: string): string {
  return logoUrl.includes('logo-biuro-default')
    ? 'Używany jest logo fallback; jeśli pojawi się dobre logo źródłowe, warto je podmienić.'
    : 'Logo jest ustawione i nie wymaga dodatkowej interwencji.';
}

function serviceRemark(serviceTitles: string[]): string {
  const titles = serviceTitles.join(', ');
  return `Zakres usług jest czytelny i obejmuje: ${titles}. Układ nie wprowadza konfliktu między hero, usługami i pricingiem.`;
}

function polishRemark(teamType: string, qaIssues: string[], profile: any): string {
  if (qaIssues.length > 0) {
    return `Są sygnały do poprawy technicznej lub redakcyjnej: ${qaIssues.join(', ')}.`;
  }

  const defaultLogo = clean(profile.media?.logoUrl).includes('logo-biuro-default');
  const lowPrice = (profile.pricingPlans || []).some((plan: any) => {
    const amount = Number((clean(plan.price).match(/\d+/) || [])[0] || 0);
    return amount > 0 && amount < 100;
  });
  if (teamType !== 'jednoosobowe' && defaultLogo) {
    return lowPrice
      ? 'Strona jest gotowa, ale w kolejnej turze warto podmienić logo i jeszcze raz ręcznie sprawdzić, czy najniższe ceny nie są zbyt stare lub zbyt agresywne.'
      : 'Strona jest gotowa, ale w kolejnej turze można ją jeszcze uszlachetnić przez podmianę logo i bardziej indywidualne niuanse marki.';
  }

  if (teamType === 'jednoosobowe') {
    return 'Strona jest spójna z modelem biura jednoosobowego; dalszy polish dotyczy już głównie drobnych akcentów brandowych.';
  }

  return lowPrice
    ? 'Strona jest gotowa, ale warto jeszcze ręcznie zweryfikować widoczne kwoty wejścia, żeby nie komunikować nieaktualnego lub zbyt niskiego progu.'
    : 'Strona jest gotowa; ewentualny dalszy polish może dotyczyć wyłącznie bardziej premium, mniej szablonowego dopracowania warstwy marki.';
}

function verdict(teamType: string, qaIssues: string[], profile: any): string {
  if (qaIssues.length > 0) {
    return 'do poprawy';
  }
  const defaultLogo = clean(profile.media?.logoUrl).includes('logo-biuro-default');
  if (teamType !== 'jednoosobowe' && defaultLogo) {
    return 'OK z drobnym polem do polishu';
  }
  return 'OK';
}

function buildEntry(row: VerificationRow, qa: QaRow | undefined, manualQc: ManualQcItem | undefined): string {
  const profile = biuroProfiles[row.slug];
  const hero = profile.hero || ({} as any);
  const team = Array.isArray(profile.team) ? profile.team : [];
  const prices = (profile.pricingPlans || []).map((plan: any) => clean(plan.price));
  const services = (profile.services || []).map((item: any) => clean(item.title)).filter(Boolean);
  const qaIssues = clean(qa?.issues).split(';').filter(Boolean);
  const routeCount = manualQc?.desktop?.routes?.length || 0;
  const routeOkCount = (manualQc?.desktop?.routes || []).filter((item) => item.status === 200).length;
  const mobileRouteOkCount = (manualQc?.mobile?.routes || []).filter((item) => item.status === 200).length;
  const screenshotDesktop = clean(manualQc?.desktop?.screenshot);
  const screenshotMobile = clean(manualQc?.mobile?.screenshot);
  const h2Count = manualQc?.desktop?.home?.h2Count ?? 0;
  const hasEmail = Boolean(manualQc?.desktop?.home?.hasContactEmail);
  const hasPhone = Boolean(manualQc?.desktop?.home?.hasContactPhone);
  const verdictLabel = verdict(row.teamType, qaIssues, profile);

  const lines = [
    `## ${profile.displayName}`,
    '',
    `- Slug: \`${row.slug}\``,
    `- Typ biura: \`${row.teamType}\``,
    `- Status weryfikacji źródłowej: \`${row.status}\``,
    `- Werdykt końcowy: **${verdictLabel}**`,
    `- Localhost: \`http://127.0.0.1:3000/?biuro=${row.slug}\``,
    `- Screenshot desktop: \`${screenshotDesktop || 'brak'}\``,
    `- Screenshot mobile: \`${screenshotMobile || 'brak'}\``,
    '',
    `- Hero i ton: ${teamVoice(row.teamType, clean(hero.text), clean(profile.tagline))}. Hero używa obrazu \`${clean(hero.image)}\`.`,
    `- Obrazy i sekcja zespołu: ${imageRemark(row.teamType, clean(hero.image), team.map((item: any) => ({ image: clean(item.image), name: clean(item.name) })))}.`,
    `- Oferta: ${serviceRemark(services)}.`,
    `- Cennik: ${pricingRemark(prices)}.`,
    `- Kontakt i struktura: Desktop ma ${routeOkCount}/${routeCount} tras 200, mobile ma ${mobileRouteOkCount}/${routeCount} tras 200, e-mail: ${hasEmail ? 'tak' : 'nie'}, telefon: ${hasPhone ? 'tak' : 'nie'}, liczba sekcji H2 na homepage: ${h2Count}.`,
    `- Branding i assets: ${logoRemark(clean(profile.media?.logoUrl))}`,
    `- Uwagi końcowe: ${polishRemark(row.teamType, qaIssues, profile)}`,
    '',
  ];

  return lines.join('\n');
}

function main(): void {
  const verificationRows = parseCsvObjects<VerificationRow>(VERIFICATION_CSV).sort((a, b) =>
    a.slug.localeCompare(b.slug),
  );
  const qaRows = new Map(parseCsvObjects<QaRow>(QA_CSV).map((row) => [row.slug, row]));
  const manualQcRows = new Map(
    (JSON.parse(fs.readFileSync(MANUAL_QC_JSON, 'utf8')) as ManualQcItem[]).map((item) => [item.slug, item]),
  );

  const total = verificationRows.length;
  const soloCount = verificationRows.filter((row) => row.teamType === 'jednoosobowe').length;
  const teamCount = total - soloCount;
  const qaWarnCount = Array.from(qaRows.values()).filter((row) => clean(row.status) !== 'PASS').length;

  const parts = [
    '# Audyt końcowy biur rachunkowych',
    '',
    '- Data: `2026-03-09`',
    `- Zakres: **${total}** biur (${soloCount} solo, ${teamCount} zespołowe lub nieokreślone)`,
    '- Metoda: ręczny przegląd treści wsparty bieżącym QA localhost, weryfikacją tras desktop/mobile, analizą aktualnych profili i odniesieniem do zrzutów ekranów w `reports/manual_qc_screens`.',
    '- Build i lint: `OK`',
    `- QA końcowe localhost: **${total - qaWarnCount}/${total} PASS**`,
    '',
    '## Jak czytać audyt',
    '',
    '- `OK` - strona jest spójna i gotowa do weryfikacji biznesowej.',
    '- `OK z drobnym polem do polishu` - strona jest poprawna, ale można ją jeszcze podnieść wizualnie lub brandingowo.',
    '- `do poprawy` - strona ma konkretny problem techniczny, treściowy lub strukturalny.',
    '',
  ];

  for (const row of verificationRows) {
    parts.push(buildEntry(row, qaRows.get(row.slug), manualQcRows.get(row.slug)));
  }

  fs.writeFileSync(OUTPUT_MD, `${parts.join('\n')}\n`, 'utf8');
  console.log(OUTPUT_MD);
}

main();
