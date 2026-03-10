import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT = process.cwd();
const READY_CSV = path.join(ROOT, 'data', 'poznan_biura_ready_pages_2026.csv');
const REPORT_DIR = path.join(ROOT, '..', 'strona-demo', 'reports');
const OUTPUT_JSON = path.join(REPORT_DIR, 'ready_pages_browser_audit.json');
const OUTPUT_CSV = path.join(REPORT_DIR, 'ready_pages_browser_audit.csv');
const OUTPUT_MD = path.join(REPORT_DIR, 'ready_pages_browser_audit.md');

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
  'banner',
  'stock',
  'dummy',
  'invoice',
  'tax-office',
  'linebgoverlay',
];

const LEGAL_RE = /(sp\.?\s*z\.?\s*o\.?\s*o\.?|s\.?a\.?|sp\.\s*k\.?|sp[oó]łka)/i;

function parseCsv(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const lines = raw.split(/\r?\n/).filter(Boolean);
  const headers = lines[0].split(',').map((v) => v.trim());
  return lines.slice(1).map((line) => {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i += 1) {
      const c = line[i];
      const n = line[i + 1];
      if (c === '"') {
        if (inQuotes && n === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += c;
      }
    }
    values.push(current);
    const row = {};
    headers.forEach((header, idx) => {
      row[header] = (values[idx] || '').trim();
    });
    return row;
  });
}

function severityFromCode(code) {
  if (code.startsWith('critical_')) return 'critical';
  if (code.startsWith('major_')) return 'major';
  return 'minor';
}

function formatCsv(rows, headers) {
  const esc = (value) => {
    const text = String(value ?? '');
    if (text.includes('"') || text.includes(',') || text.includes('\n')) {
      return `"${text.replaceAll('"', '""')}"`;
    }
    return text;
  };
  const out = [headers.join(',')];
  for (const row of rows) {
    out.push(headers.map((h) => esc(row[h])).join(','));
  }
  return `${out.join('\n')}\n`;
}

function issue(code, details) {
  return { code, severity: severityFromCode(code), details };
}

async function inspectHomepage(page, slug) {
  const result = await page.evaluate(({ slug, NON_PERSON_TOKENS }) => {
    const text = document.body?.innerText || '';
    const lowerText = text.toLowerCase();

    const navBrand = document.querySelector('header a span.font-bold')?.textContent?.trim() || '';
    const heroH1 = document.querySelector('section#home h1')?.textContent?.trim() || '';
    const heroImage = document.querySelector('section#home img[alt*="zdjęcie biura"]');
    const heroImageSrc = heroImage?.getAttribute('src') || '';
    const heroImageLower = heroImageSrc.toLowerCase();

    const navbarLogoImg = document.querySelector('header a img[alt*="logo"]');
    const heroBadgeLogoImg = document.querySelector('section#home img[alt*="logo"]');
    const footerLogoImg = document.querySelector('footer a img[alt*="logo"]');

    const teamSection = document.querySelector('#zespol');
    const teamHeading = teamSection?.querySelector('h2')?.textContent?.trim() || '';
    const teamImages = Array.from(teamSection?.querySelectorAll('img') || [])
      .map((img) => img.getAttribute('src') || '')
      .filter(Boolean);

    const uniqueTeamImages = new Set(teamImages);
    const duplicateTeamImages = teamImages.length > 1 && uniqueTeamImages.size < teamImages.length;
    const nonPersonTeamImage = teamImages.some((src) => {
      const lowered = src.toLowerCase();
      return NON_PERSON_TOKENS.some((token) => lowered.includes(token));
    });

    const hasEfektyHeading = Array.from(document.querySelectorAll('h2')).some((h2) =>
      (h2.textContent || '').toLowerCase().includes('efekty współpracy'),
    );
    const hasWzorcowyEfektyHeading = Array.from(document.querySelectorAll('h2')).some(
      (h2) => (h2.textContent || '').trim().toLowerCase() === 'efekty współpracy',
    );
    const hasStats100 = lowerText.includes('100+') && lowerText.includes('zadowolonych klientów');
    const hasStats24h = lowerText.includes('24h') && lowerText.includes('czas odpowiedzi');
    const hasStats10y = lowerText.includes('10+ lat') && lowerText.includes('doświadczenia');

    const trustStripCount = (text.match(/Dedykowana opieka księgowa i szybki kontakt/g) || []).length;
    const hasContactWebsiteLabel = lowerText.includes('strona www');

    const socialIcons = Array.from(document.querySelectorAll('footer a[aria-label]')).map((a) =>
      (a.getAttribute('aria-label') || '').toLowerCase(),
    );

    const heroHasNonPersonToken = NON_PERSON_TOKENS.some((token) => heroImageLower.includes(token));
    const heroIsFallback = heroImageLower.includes('/images/hero-accountant-fallback');

    return {
      slug,
      navBrand,
      heroH1,
      heroImageSrc,
      hasNavbarLogoImg: Boolean(navbarLogoImg),
      hasHeroBadgeLogoImg: Boolean(heroBadgeLogoImg),
      hasFooterLogoImg: Boolean(footerLogoImg),
      teamHeading,
      teamImageCount: teamImages.length,
      duplicateTeamImages,
      nonPersonTeamImage,
      hasEfektyHeading,
      hasWzorcowyEfektyHeading,
      hasStats100,
      hasStats24h,
      hasStats10y,
      trustStripCount,
      hasContactWebsiteLabel,
      socialCount: socialIcons.length,
      heroHasNonPersonToken,
      heroIsFallback,
    };
  }, { slug, NON_PERSON_TOKENS });

  return result;
}

async function auditSlug(browser, slug) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const requestFailures = [];
  const responseErrors = [];
  const consoleErrors = [];

  page.on('requestfailed', (request) => {
    const url = request.url();
    if (url.includes('127.0.0.1:3000') || url.includes('localhost:3000')) {
      requestFailures.push({
        url,
        method: request.method(),
        reason: request.failure()?.errorText || 'unknown',
      });
    }
  });

  page.on('response', (response) => {
    const url = response.url();
    if (!(url.includes('127.0.0.1:3000') || url.includes('localhost:3000'))) return;
    if (response.status() >= 400) {
      responseErrors.push({ url, status: response.status() });
    }
  });

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!text.includes('favicon.ico')) {
        consoleErrors.push(text);
      }
    }
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

      const hasNotFound = await page
        .locator('text=404')
        .first()
        .isVisible()
        .catch(() => false);
      if (hasNotFound) {
        issues.push(issue('critical_route_404_view', route));
      }
    } catch (err) {
      routeStatuses.push({ route, status: 0 });
      issues.push(issue('critical_route_navigation_failed', `${route} -> ${String(err)}`));
    }
  }

  await page.goto(`${BASE_URL}/?biuro=${slug}`, { waitUntil: 'networkidle', timeout: 45000 });
  const homepage = await inspectHomepage(page, slug);

  if (LEGAL_RE.test(homepage.navBrand)) {
    issues.push(issue('major_legal_suffix_in_nav_brand', homepage.navBrand));
  }
  if (LEGAL_RE.test(homepage.heroH1)) {
    issues.push(issue('major_legal_suffix_in_hero_h1', homepage.heroH1));
  }

  if (!homepage.hasNavbarLogoImg) {
    issues.push(issue('major_logo_missing_navbar', 'Brak logotypu w navbarze (fallback litera).'));
  }
  if (!homepage.hasHeroBadgeLogoImg) {
    issues.push(issue('major_logo_missing_hero_badge', 'Brak logotypu w badge hero.'));
  }
  if (!homepage.hasFooterLogoImg) {
    issues.push(issue('major_logo_missing_footer', 'Brak logotypu w stopce.'));
  }

  if (homepage.heroIsFallback) {
    issues.push(issue('major_hero_fallback_image', homepage.heroImageSrc || 'fallback')); 
  }
  if (homepage.heroHasNonPersonToken) {
    issues.push(issue('major_hero_non_person_like_image', homepage.heroImageSrc));
  }

  if (homepage.trustStripCount !== 1) {
    issues.push(issue('major_hero_trust_strip_count', `Liczba trust strip: ${homepage.trustStripCount}`));
  }

  if (homepage.duplicateTeamImages) {
    issues.push(issue('major_team_duplicate_images', 'Duplikaty zdjęć w sekcji zespołu.'));
  }
  if (homepage.nonPersonTeamImage) {
    issues.push(issue('major_team_non_person_image', 'Wykryto zdjęcie nietwarzowe w zespole.'));
  }

  if (!homepage.hasEfektyHeading) {
    issues.push(issue('major_missing_efekty_section_heading', 'Brak sekcji Efekty współpracy.'));
  } else if (!homepage.hasWzorcowyEfektyHeading) {
    issues.push(issue('minor_nonstandard_efekty_section_heading', 'Nagłówek różni się od "Efekty współpracy".'));
  }

  if (!homepage.hasStats100 || !homepage.hasStats24h || !homepage.hasStats10y) {
    issues.push(issue('major_missing_effect_stats', 'Brakuje jednego z: 100+, 24h, 10+ lat.'));
  }

  if (homepage.hasContactWebsiteLabel) {
    issues.push(issue('major_contact_has_strona_www_block', 'W sekcji kontaktu widoczny blok "Strona www".'));
  }

  if (homepage.socialCount === 0) {
    issues.push(issue('minor_social_links_missing', 'Brak linków social w stopce.'));
  }

  if (requestFailures.length > 0) {
    const unique = [...new Set(requestFailures.map((r) => `${r.method} ${r.url} (${r.reason})`))].slice(0, 8);
    issues.push(issue('major_request_failures', unique.join(' | ')));
  }
  if (responseErrors.length > 0) {
    const unique = [...new Set(responseErrors.map((r) => `${r.status} ${r.url}`))].slice(0, 8);
    issues.push(issue('major_http_errors', unique.join(' | ')));
  }
  if (consoleErrors.length > 0) {
    const unique = [...new Set(consoleErrors)].slice(0, 8);
    issues.push(issue('major_console_errors', unique.join(' | ')));
  }

  await context.close();

  return {
    slug,
    routeStatuses,
    homepage,
    issues,
    issueCount: issues.length,
    criticalCount: issues.filter((x) => x.severity === 'critical').length,
    majorCount: issues.filter((x) => x.severity === 'major').length,
    minorCount: issues.filter((x) => x.severity === 'minor').length,
  };
}

async function main() {
  if (!fs.existsSync(READY_CSV)) {
    throw new Error(`Missing CSV: ${READY_CSV}`);
  }
  fs.mkdirSync(REPORT_DIR, { recursive: true });

  const rows = parseCsv(READY_CSV).filter((row) => row.status === 'ready');
  const slugs = rows.map((row) => row.slug).filter(Boolean);

  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (let i = 0; i < slugs.length; i += 1) {
    const slug = slugs[i];
    console.log(`[${i + 1}/${slugs.length}] ${slug}`);
    const result = await auditSlug(browser, slug);
    results.push(result);
  }

  await browser.close();

  fs.writeFileSync(OUTPUT_JSON, `${JSON.stringify(results, null, 2)}\n`, 'utf8');

  const csvRows = [];
  for (const result of results) {
    if (result.issues.length === 0) {
      csvRows.push({
        slug: result.slug,
        severity: 'ok',
        code: 'ok',
        details: '',
      });
      continue;
    }
    for (const it of result.issues) {
      csvRows.push({
        slug: result.slug,
        severity: it.severity,
        code: it.code,
        details: it.details,
      });
    }
  }
  fs.writeFileSync(OUTPUT_CSV, formatCsv(csvRows, ['slug', 'severity', 'code', 'details']), 'utf8');

  const totalIssues = results.reduce((acc, r) => acc + r.issueCount, 0);
  const critical = results.reduce((acc, r) => acc + r.criticalCount, 0);
  const major = results.reduce((acc, r) => acc + r.majorCount, 0);
  const minor = results.reduce((acc, r) => acc + r.minorCount, 0);
  const clean = results.filter((r) => r.issueCount === 0).length;

  const issueByCode = new Map();
  for (const result of results) {
    for (const it of result.issues) {
      issueByCode.set(it.code, (issueByCode.get(it.code) || 0) + 1);
    }
  }

  const sortedCodes = [...issueByCode.entries()].sort((a, b) => b[1] - a[1]);

  const lines = [];
  lines.push('# Ready Pages Browser Audit (30 stron)');
  lines.push('');
  lines.push(`- Sprawdzone strony: **${results.length}**`);
  lines.push(`- Strony bez wykrytych problemów: **${clean}**`);
  lines.push(`- Wszystkie problemy: **${totalIssues}** (critical: **${critical}**, major: **${major}**, minor: **${minor}**)`);
  lines.push('');
  lines.push('## Najczęstsze problemy');
  for (const [code, count] of sortedCodes.slice(0, 15)) {
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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
