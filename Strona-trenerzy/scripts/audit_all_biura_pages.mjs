import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT = process.cwd();
const RESEARCH_JSON = path.join(ROOT, '..', 'strona-demo', 'src', 'data', 'biura', 'biuroResearch.generated.json');
const REPORT_DIR = path.join(ROOT, '..', 'strona-demo', 'reports');
const OUTPUT_JSON = path.join(REPORT_DIR, 'all_pages_browser_audit.json');
const OUTPUT_CSV = path.join(REPORT_DIR, 'all_pages_browser_audit.csv');
const OUTPUT_MD = path.join(REPORT_DIR, 'all_pages_browser_audit.md');

const BASE_URL = 'http://127.0.0.1:3000';
const ROUTES = [
  '/',
  '/pelna-ksiegowosc',
  '/kpir-ryczalt',
  '/kadry-zus',
  '/obsluga-ksef',
  '/doradztwo-podatkowe',
  '/sprawozdania',
  '/o-nas',
  '/wiedza',
];

const NON_PERSON_TOKENS = [
  'real-estate',
  'building',
  'biurow',
  'office',
  'nieruchom',
  'wnetrz',
  'interior',
  'logo',
  'icon',
  'ikona',
  'banner',
  'stock',
  'dummy',
  'invoice',
  'tax-office',
  'linebg',
  'linebgoverlay',
  'slide',
  'slider',
  'social',
  'favicon',
  'map',
];

const BROKEN_TEXT_MARKERS = ['Ã', 'Å', 'Ä', 'Ë', 'Œ', '�', '%d', '⬅', '☎'];

function loadSlugsFromResearch(filePath) {
  const rows = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return rows
    .filter((row) => row && row.slug)
    .map((row) => row.slug);
}

function severityFromCode(code) {
  if (code.startsWith('critical_')) return 'critical';
  if (code.startsWith('major_')) return 'major';
  return 'minor';
}

function issue(code, details) {
  return { code, severity: severityFromCode(code), details };
}

function formatCsv(rows, headers) {
  const esc = (value) => {
    const text = String(value ?? '');
    if (text.includes('"') || text.includes(',') || text.includes('\n')) {
      return `"${text.replaceAll('"', '""')}"`;
    }
    return text;
  };

  const output = [headers.join(',')];
  for (const row of rows) {
    output.push(headers.map((header) => esc(row[header])).join(','));
  }
  return `${output.join('\n')}\n`;
}

async function inspectHomepage(page, slug) {
  return page.evaluate(({ slug, NON_PERSON_TOKENS, BROKEN_TEXT_MARKERS }) => {
    const text = document.body?.innerText || '';
    const lowerText = text.toLowerCase();

    const heroHeading = document.querySelector('section#home h1')?.textContent?.trim() || '';
    const heroDescription = document.querySelector('section#home p')?.textContent?.trim() || '';
    const heroImage = document.querySelector('section#home img[alt*="zdjęcie biura"]');
    const heroImageSrc = heroImage?.getAttribute('src') || '';

    const teamImages = Array.from(document.querySelectorAll('#zespol img'))
      .map((img) => img.getAttribute('src') || '')
      .filter(Boolean);

    const hasNavbarLogoImg = Boolean(document.querySelector('header a img[alt*="logo"]'));
    const hasHeroBadgeLogoImg = Boolean(document.querySelector('section#home img[alt*="logo"]'));
    const hasFooterLogoImg = Boolean(document.querySelector('footer a img[alt*="logo"]'));

    const containsBrokenText = BROKEN_TEXT_MARKERS.some(
      (marker) => lowerText.includes(marker.toLowerCase()) || heroDescription.toLowerCase().includes(marker.toLowerCase()),
    );

    const heroNonPerson = NON_PERSON_TOKENS.some((token) => heroImageSrc.toLowerCase().includes(token));
    const teamNonPerson = teamImages.some((src) => NON_PERSON_TOKENS.some((token) => src.toLowerCase().includes(token)));
    const teamHasDuplicates = teamImages.length > 1 && new Set(teamImages).size < teamImages.length;

    return {
      slug,
      heroHeading,
      heroDescription,
      heroImageSrc,
      teamImages,
      hasNavbarLogoImg,
      hasHeroBadgeLogoImg,
      hasFooterLogoImg,
      containsBrokenText,
      heroNonPerson,
      teamNonPerson,
      teamHasDuplicates,
    };
  }, { slug, NON_PERSON_TOKENS, BROKEN_TEXT_MARKERS });
}

async function auditSlug(browser, slug) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const responseErrors = [];
  const consoleErrors = [];

  page.on('response', (response) => {
    const url = response.url();
    if (!(url.includes('127.0.0.1:3000') || url.includes('localhost:3000'))) {
      return;
    }
    if (response.status() >= 400) {
      responseErrors.push({ status: response.status(), url });
    }
  });

  page.on('console', (msg) => {
    if (msg.type() !== 'error') {
      return;
    }
    const text = msg.text();
    if (text.includes('favicon.ico')) {
      return;
    }
    consoleErrors.push(text);
  });

  const issues = [];
  const routeStatuses = [];

  for (const route of ROUTES) {
    const url = `${BASE_URL}${route}?biuro=${slug}`;
    try {
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      const status = response?.status?.() ?? 0;
      routeStatuses.push({ route, status });
      if (status !== 200) {
        issues.push(issue('critical_route_not_200', `${route} -> ${status}`));
      }
    } catch (error) {
      routeStatuses.push({ route, status: 0 });
      issues.push(issue('critical_route_navigation_failed', `${route} -> ${String(error)}`));
    }
  }

  await page.goto(`${BASE_URL}/?biuro=${slug}`, { waitUntil: 'networkidle', timeout: 45000 });
  const homepage = await inspectHomepage(page, slug);

  if (!homepage.hasNavbarLogoImg) {
    issues.push(issue('major_logo_missing_navbar', 'Brak logo w navbarze.'));
  }
  if (!homepage.hasHeroBadgeLogoImg) {
    issues.push(issue('major_logo_missing_hero_badge', 'Brak logo w badge hero.'));
  }
  if (!homepage.hasFooterLogoImg) {
    issues.push(issue('major_logo_missing_footer', 'Brak logo w stopce.'));
  }

  if (homepage.heroNonPerson) {
    issues.push(issue('major_hero_non_person_like_image', homepage.heroImageSrc));
  }
  if (homepage.teamNonPerson) {
    issues.push(issue('major_team_non_person_image', homepage.teamImages.join(' | ')));
  }
  if (homepage.teamHasDuplicates) {
    issues.push(issue('minor_team_duplicate_images', homepage.teamImages.join(' | ')));
  }

  if (homepage.containsBrokenText) {
    issues.push(issue('major_broken_scraped_copy', homepage.heroDescription || homepage.heroHeading || 'broken copy'));
  }

  if (homepage.heroDescription.length < 45) {
    issues.push(issue('major_hero_description_too_short', homepage.heroDescription));
  }

  if (responseErrors.length > 0) {
    const unique = [...new Set(responseErrors.map((entry) => `${entry.status} ${entry.url}`))].slice(0, 10);
    issues.push(issue('major_http_errors', unique.join(' | ')));
  }
  if (consoleErrors.length > 0) {
    const unique = [...new Set(consoleErrors)].slice(0, 10);
    issues.push(issue('major_console_errors', unique.join(' | ')));
  }

  await context.close();

  return {
    slug,
    routeStatuses,
    homepage,
    issues,
    issueCount: issues.length,
    criticalCount: issues.filter((it) => it.severity === 'critical').length,
    majorCount: issues.filter((it) => it.severity === 'major').length,
    minorCount: issues.filter((it) => it.severity === 'minor').length,
  };
}

async function main() {
  if (!fs.existsSync(RESEARCH_JSON)) {
    throw new Error(`Missing research JSON: ${RESEARCH_JSON}`);
  }

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const slugs = loadSlugsFromResearch(RESEARCH_JSON);

  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (let index = 0; index < slugs.length; index += 1) {
    const slug = slugs[index];
    console.log(`[${index + 1}/${slugs.length}] ${slug}`);
    const result = await auditSlug(browser, slug);
    results.push(result);
  }

  await browser.close();

  fs.writeFileSync(OUTPUT_JSON, `${JSON.stringify(results, null, 2)}\n`, 'utf8');

  const csvRows = [];
  for (const result of results) {
    if (result.issues.length === 0) {
      csvRows.push({ slug: result.slug, severity: 'ok', code: 'ok', details: '' });
      continue;
    }
    for (const it of result.issues) {
      csvRows.push({ slug: result.slug, severity: it.severity, code: it.code, details: it.details });
    }
  }
  fs.writeFileSync(OUTPUT_CSV, formatCsv(csvRows, ['slug', 'severity', 'code', 'details']), 'utf8');

  const totalIssues = results.reduce((acc, result) => acc + result.issueCount, 0);
  const critical = results.reduce((acc, result) => acc + result.criticalCount, 0);
  const major = results.reduce((acc, result) => acc + result.majorCount, 0);
  const minor = results.reduce((acc, result) => acc + result.minorCount, 0);
  const cleanPages = results.filter((result) => result.issueCount === 0).length;

  const issueByCode = new Map();
  for (const result of results) {
    for (const it of result.issues) {
      issueByCode.set(it.code, (issueByCode.get(it.code) || 0) + 1);
    }
  }
  const topIssues = [...issueByCode.entries()].sort((a, b) => b[1] - a[1]);

  const lines = [];
  lines.push('# All Pages Browser Audit (wszystkie profile)');
  lines.push('');
  lines.push(`- Sprawdzone strony: **${results.length}**`);
  lines.push(`- Strony bez wykrytych problemów: **${cleanPages}**`);
  lines.push(`- Wszystkie problemy: **${totalIssues}** (critical: **${critical}**, major: **${major}**, minor: **${minor}**)`);
  lines.push('');
  lines.push('## Najczęstsze problemy');
  for (const [code, count] of topIssues.slice(0, 15)) {
    lines.push(`- ${code}: ${count}`);
  }
  lines.push('');
  lines.push('## Problemy per slug');
  for (const result of results) {
    if (result.issues.length === 0) {
      lines.push(`- ${result.slug}: OK`);
      continue;
    }
    const compact = result.issues.map((it) => `${it.severity}:${it.code}`).join(', ');
    lines.push(`- ${result.slug}: ${compact}`);
  }
  lines.push('');
  lines.push('Szczegóły:');
  lines.push(`- JSON: ${OUTPUT_JSON}`);
  lines.push(`- CSV: ${OUTPUT_CSV}`);

  fs.writeFileSync(OUTPUT_MD, `${lines.join('\n')}\n`, 'utf8');

  console.log(`Saved: ${OUTPUT_JSON}`);
  console.log(`Saved: ${OUTPUT_CSV}`);
  console.log(`Saved: ${OUTPUT_MD}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
