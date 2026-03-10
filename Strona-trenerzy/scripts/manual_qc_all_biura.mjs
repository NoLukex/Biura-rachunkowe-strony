import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT = process.cwd();
const RESEARCH_JSON = path.join(ROOT, '..', 'strona-demo', 'src', 'data', 'biura', 'biuroResearch.generated.json');
const REPORT_DIR = path.join(ROOT, '..', 'strona-demo', 'reports');
const SCREEN_DIR = path.join(REPORT_DIR, 'manual_qc_screens');
const OUTPUT_JSON = path.join(REPORT_DIR, 'manual_qc_all_biura.json');
const OUTPUT_MD = path.join(REPORT_DIR, 'manual_qc_all_biura.md');
const OUTPUT_CSV = path.join(REPORT_DIR, 'manual_qc_all_biura.csv');

const BASE_URL = 'http://127.0.0.1:3000';
const ROUTES = ['/', '/pelna-ksiegowosc', '/kpir-ryczalt', '/kadry-zus', '/obsluga-ksef', '/doradztwo-podatkowe', '/sprawozdania', '/o-nas', '/wiedza'];
const MOJIBAKE = ['Ã', 'Å', 'Ä', 'Ë', 'Œ', '�'];
const NON_PERSON_TOKENS = ['logo', 'icon', 'banner', 'building', 'office', 'nieruchom', 'real-estate', 'invoice', 'linebg', 'linebgoverlay', 'social'];

function loadSlugs() {
  const rows = JSON.parse(fs.readFileSync(RESEARCH_JSON, 'utf8'));
  return rows.map((r) => r.slug).filter(Boolean);
}

function ensureDirs() {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.mkdirSync(SCREEN_DIR, { recursive: true });
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

function pushIssue(issues, severity, code, details) {
  issues.push({ severity, code, details });
}

async function checkRoute(page, slug, route) {
  const url = `${BASE_URL}${route}?biuro=${slug}`;
  try {
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    return { route, status: response?.status?.() ?? 0 };
  } catch {
    return { route, status: 0 };
  }
}

async function inspectHome(page, slug) {
  await page.goto(`${BASE_URL}/?biuro=${slug}`, { waitUntil: 'networkidle', timeout: 45000 });
  await page.locator('#zespol').scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(350);
  await page.locator('#home').scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(150);
  return page.evaluate(({ MOJIBAKE, NON_PERSON_TOKENS }) => {
    const text = document.body?.innerText || '';
    const heroTitle = document.querySelector('section#home h1')?.textContent?.trim() || '';
    const heroText = document.querySelector('section#home p')?.textContent?.trim() || '';
    const heroImg = document.querySelector('section#home img[alt*="zdjęcie biura"]');
    const heroSrc = heroImg?.getAttribute('src') || '';
    const heroNaturalWidth = heroImg instanceof HTMLImageElement ? heroImg.naturalWidth : 0;

    const teamImgs = Array.from(document.querySelectorAll('#zespol img')).map((img) => ({
      src: img.getAttribute('src') || '',
      width: img instanceof HTMLImageElement ? img.naturalWidth : 0,
    }));

    const mojibake = MOJIBAKE.some((token) => text.includes(token));
    const nonPersonTeam = teamImgs.some((img) => {
      const lowered = img.src.toLowerCase();
      return NON_PERSON_TOKENS.some((token) => lowered.includes(token));
    });

    const hasContactEmail = /@[a-z0-9.-]+\.[a-z]{2,}/i.test(text);
    const hasContactPhone = /(?:\+?48[\s-]?)?(?:\d[\s-]?){9,11}/.test(text);
    const h2Count = document.querySelectorAll('h2').length;

    return {
      heroTitle,
      heroText,
      heroSrc,
      heroNaturalWidth,
      teamImgs,
      mojibake,
      nonPersonTeam,
      hasContactEmail,
      hasContactPhone,
      h2Count,
    };
  }, { MOJIBAKE, NON_PERSON_TOKENS });
}

async function runForViewport(browser, slug, viewport, suffix) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const issues = [];
  const consoleErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!text.includes('favicon.ico')) {
        consoleErrors.push(text);
      }
    }
  });

  const routes = [];
  for (const route of ROUTES) {
    const result = await checkRoute(page, slug, route);
    routes.push(result);
    if (result.status !== 200) {
      pushIssue(issues, 'critical', 'route_not_200', `${route} -> ${result.status}`);
    }
  }

  const home = await inspectHome(page, slug);

  if (!home.heroTitle || home.heroTitle.length < 6) {
    pushIssue(issues, 'major', 'hero_title_missing', home.heroTitle || 'empty');
  }
  if (!home.heroText || home.heroText.length < 45) {
    pushIssue(issues, 'major', 'hero_text_short', home.heroText || 'empty');
  }
  if (home.heroNaturalWidth < 120) {
    pushIssue(issues, 'major', 'hero_image_not_loaded', `${home.heroSrc} width=${home.heroNaturalWidth}`);
  }
  if (home.teamImgs.length < 1) {
    pushIssue(issues, 'major', 'team_missing', 'No team images');
  }
  const loadedTeamImages = home.teamImgs.filter((img) => img.width >= 120);
  if (home.teamImgs.length > 0 && loadedTeamImages.length === 0) {
    pushIssue(issues, 'major', 'team_image_not_loaded', home.teamImgs.map((img) => `${img.src}:${img.width}`).join(' | '));
  }
  if (home.nonPersonTeam) {
    pushIssue(issues, 'major', 'team_non_person_image', home.teamImgs.map((img) => img.src).join(' | '));
  }
  if (home.mojibake) {
    pushIssue(issues, 'major', 'mojibake_text', 'Detected broken encoding markers');
  }
  if (!home.hasContactEmail) {
    pushIssue(issues, 'major', 'contact_email_missing', 'No email found in visible text');
  }
  if (!home.hasContactPhone) {
    pushIssue(issues, 'major', 'contact_phone_missing', 'No phone found in visible text');
  }
  if (home.h2Count < 4) {
    pushIssue(issues, 'minor', 'sections_low_count', `h2=${home.h2Count}`);
  }

  if (consoleErrors.length > 0) {
    pushIssue(issues, 'major', 'console_errors', [...new Set(consoleErrors)].slice(0, 6).join(' | '));
  }

  const shotPath = path.join(SCREEN_DIR, `${slug}-${suffix}.png`);
  await page.goto(`${BASE_URL}/?biuro=${slug}`, { waitUntil: 'networkidle', timeout: 45000 });
  await page.screenshot({ path: shotPath, fullPage: true });

  await context.close();

  return {
    viewport: suffix,
    routes,
    home,
    issues,
    screenshot: shotPath,
  };
}

async function main() {
  ensureDirs();
  const slugs = loadSlugs();
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (let i = 0; i < slugs.length; i += 1) {
    const slug = slugs[i];
    console.log(`[${i + 1}/${slugs.length}] ${slug}`);
    const desktop = await runForViewport(browser, slug, { width: 1440, height: 900 }, 'desktop');
    const mobile = await runForViewport(browser, slug, { width: 390, height: 844 }, 'mobile');

    const issues = [...desktop.issues, ...mobile.issues];
    results.push({
      slug,
      status: issues.length === 0 ? 'OK' : 'ISSUE',
      issueCount: issues.length,
      desktop,
      mobile,
      issues,
    });
  }

  await browser.close();

  fs.writeFileSync(OUTPUT_JSON, `${JSON.stringify(results, null, 2)}\n`, 'utf8');

  const csvRows = [];
  for (const result of results) {
    if (result.issues.length === 0) {
      csvRows.push({ slug: result.slug, status: result.status, severity: 'ok', code: 'ok', details: '' });
      continue;
    }
    for (const issue of result.issues) {
      csvRows.push({
        slug: result.slug,
        status: result.status,
        severity: issue.severity,
        code: issue.code,
        details: issue.details,
      });
    }
  }

  fs.writeFileSync(OUTPUT_CSV, formatCsv(csvRows, ['slug', 'status', 'severity', 'code', 'details']), 'utf8');

  const ok = results.filter((r) => r.status === 'OK').length;
  const issue = results.length - ok;
  const allIssues = results.flatMap((r) => r.issues);
  const critical = allIssues.filter((i) => i.severity === 'critical').length;
  const major = allIssues.filter((i) => i.severity === 'major').length;
  const minor = allIssues.filter((i) => i.severity === 'minor').length;

  const byCode = new Map();
  for (const it of allIssues) {
    byCode.set(it.code, (byCode.get(it.code) || 0) + 1);
  }
  const topCodes = [...byCode.entries()].sort((a, b) => b[1] - a[1]);

  const lines = [];
  lines.push('# Manual QA All Biura (Desktop + Mobile)');
  lines.push('');
  lines.push(`- Sprawdzone profile: **${results.length}**`);
  lines.push(`- OK: **${ok}**`);
  lines.push(`- ISSUE: **${issue}**`);
  lines.push(`- Problemy łącznie: **${allIssues.length}** (critical: **${critical}**, major: **${major}**, minor: **${minor}**)`);
  lines.push(`- Zrzuty ekranów: **${SCREEN_DIR}**`);
  lines.push('');
  lines.push('## Najczęstsze problemy');
  for (const [code, count] of topCodes.slice(0, 12)) {
    lines.push(`- ${code}: ${count}`);
  }
  lines.push('');
  lines.push('## Status per slug');
  for (const result of results) {
    if (result.status === 'OK') {
      lines.push(`- ${result.slug}: OK`);
      continue;
    }
    const compact = result.issues.map((i) => `${i.severity}:${i.code}`).join(', ');
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
