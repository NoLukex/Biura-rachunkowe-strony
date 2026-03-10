import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const reportsDir = path.join(root, 'reports');
const clientsDir = path.join(root, 'klienci');
const reviewPath = path.join(reportsDir, 'email_trainers_local_review_2026-02-21.md');

const readLatestDeployCsv = () => {
  const latest = fs
    .readdirSync(reportsDir)
    .filter((name) => /^redeploy_quickwins_uiux_\d{8}_\d{6}\.csv$/.test(name))
    .sort()
    .pop();

  if (!latest) {
    throw new Error('Brak pliku redeploy_quickwins_uiux_*.csv w reports/.');
  }

  return {
    name: latest,
    path: path.join(reportsDir, latest),
  };
};

const normalizeText = (value) =>
  (value || '')
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (char) => {
      const map = {
        ą: 'a',
        ć: 'c',
        ę: 'e',
        ł: 'l',
        ń: 'n',
        ó: 'o',
        ś: 's',
        ź: 'z',
        ż: 'z',
      };
      return map[char] || char;
    })
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();

const onlyDigits = (value) => (value || '').replace(/\D/g, '');

const normalizeUrl = (value) => {
  if (!value) {
    return '';
  }

  try {
    const parsed = new URL(value);
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();
    const pathname = parsed.pathname.replace(/\/$/, '').toLowerCase();
    return `${host}${pathname}`;
  } catch {
    return value
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '');
  }
};

const urlLooselyMatches = (expected, actual) => {
  const a = normalizeUrl(expected);
  const b = normalizeUrl(actual);
  if (!a && !b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  return a === b || a.startsWith(b) || b.startsWith(a);
};

const parseReviewEntries = () => {
  const text = fs.readFileSync(reviewPath, 'utf8');
  const entries = [];
  const regex = /^\d+\.\s+(.+?)\s+-\s+http:\/\/localhost:5173\/\?trainer=([a-z0-9-]+)/gm;
  for (const match of text.matchAll(regex)) {
    entries.push({
      reportName: match[1].trim(),
      slug: match[2].trim(),
    });
  }
  return entries;
};

const parseCsv = (csvPath) => {
  const lines = fs.readFileSync(csvPath, 'utf8').trim().split(/\r?\n/);
  const rows = [];
  for (const line of lines.slice(1)) {
    const cols = line.split(',');
    rows.push({
      slug: cols[0] || '',
      project: cols[1] || '',
      status: cols[2] || '',
      url: cols[3] || '',
    });
  }
  return rows;
};

const parseProfile = (slug) => {
  const profilePath = path.join(clientsDir, slug, 'profile.ts');
  if (!fs.existsSync(profilePath)) {
    return null;
  }

  const content = fs.readFileSync(profilePath, 'utf8');
  const pick = (field) => {
    const match = content.match(new RegExp(`${field}:\\s*'([^']*)'`));
    return match ? match[1].trim() : '';
  };

  return {
    fullName: pick('fullName'),
    navName: pick('navName'),
    phone: pick('phone'),
    email: pick('email'),
    website: pick('website'),
    instagram: pick('instagram'),
    facebook: pick('facebook'),
    profilePath,
  };
};

const auditPage = async (browser, url) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const runtimeErrors = [];

  page.on('pageerror', (error) => runtimeErrors.push(`pageerror:${error.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!/favicon|Failed to load resource/i.test(text)) {
        runtimeErrors.push(`console:${text}`);
      }
    }
  });

  let httpStatus = '';
  try {
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    httpStatus = response ? String(response.status()) : 'no-response';
  } catch (error) {
    await context.close();
    return {
      ok: false,
      issues: [`exception:${error instanceof Error ? error.message : String(error)}`],
      data: null,
      httpStatus: 'error',
    };
  }

  const data = await page.evaluate(() => {
    const getHref = (label) => {
      const target = document.querySelector(`a[aria-label="${label}"]`);
      return target ? target.getAttribute('href') || '' : '';
    };

    const telLinks = Array.from(document.querySelectorAll('a[href^="tel:"]')).map((el) => el.getAttribute('href') || '');
    const navBrand = document.querySelector('nav span.text-2xl')?.textContent?.trim() || '';
    const heading = document.querySelector('#about h2')?.textContent?.trim() || '';
    const bodyText = document.body?.innerText || '';

    return {
      telLinks,
      navBrand,
      aboutHeading: heading,
      bodyText,
      instagramHref: getHref('Instagram'),
      facebookHref: getHref('Facebook'),
      websiteHref: getHref('Strona internetowa'),
    };
  });

  await context.close();
  return {
    ok: true,
    issues: runtimeErrors,
    data,
    httpStatus,
  };
};

const main = async () => {
  const deployCsv = readLatestDeployCsv();
  const reviewEntries = parseReviewEntries();
  const deployRows = parseCsv(deployCsv.path);
  const deployBySlug = Object.fromEntries(deployRows.map((row) => [row.slug, row]));

  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const entry of reviewEntries) {
    const issues = [];
    const deploy = deployBySlug[entry.slug];
    const profile = parseProfile(entry.slug);

    if (!deploy?.url) {
      results.push({
        slug: entry.slug,
        url: '',
        status: 'fail',
        reportName: entry.reportName,
        expectedName: profile?.fullName || '',
        pageName: '',
        expectedPhone: profile?.phone || '',
        pagePhone: '',
        issues: 'missing_deploy_url',
      });
      continue;
    }

    if (!profile) {
      results.push({
        slug: entry.slug,
        url: deploy.url,
        status: 'fail',
        reportName: entry.reportName,
        expectedName: '',
        pageName: '',
        expectedPhone: '',
        pagePhone: '',
        issues: 'missing_profile_file',
      });
      continue;
    }

    const pageAudit = await auditPage(browser, deploy.url);
    if (!pageAudit.ok || !pageAudit.data) {
      results.push({
        slug: entry.slug,
        url: deploy.url,
        status: 'fail',
        reportName: entry.reportName,
        expectedName: profile.fullName,
        pageName: '',
        expectedPhone: profile.phone,
        pagePhone: '',
        issues: pageAudit.issues.join(' | ') || 'load_failed',
      });
      continue;
    }

    const expectedName = profile.fullName || profile.navName;
    const reportNorm = normalizeText(entry.reportName);
    const expectedNorm = normalizeText(expectedName);
    const expectedTokens = expectedNorm.split(' ').filter((token) => token.length > 2);
    const reportNameOk =
      expectedTokens.length >= 2
        ? reportNorm.includes(expectedTokens[0]) && reportNorm.includes(expectedTokens[expectedTokens.length - 1])
        : reportNorm.includes(expectedNorm) || expectedNorm.includes(reportNorm);
    if (!reportNameOk) {
      issues.push(`report_name_mismatch:${entry.reportName}!=${expectedName}`);
    }

    const pageTextNorm = normalizeText(pageAudit.data.bodyText);
    const expectedNameNorm = normalizeText(expectedName);
    if (!pageTextNorm.includes(expectedNameNorm)) {
      issues.push('name_not_found_in_page_text');
    }

    const navNorm = normalizeText(pageAudit.data.navBrand).replace(/\s+/g, '');
    const surname = normalizeText(expectedName).split(' ').slice(-1)[0] || '';
    if (surname && !navNorm.includes(surname.replace(/\s+/g, ''))) {
      issues.push(`nav_name_mismatch:${pageAudit.data.navBrand}`);
    }

    const expectedPhoneDigits = onlyDigits(profile.phone);
    const pagePhoneDigits = onlyDigits(pageAudit.data.telLinks[0] || '');
    if (expectedPhoneDigits && expectedPhoneDigits !== pagePhoneDigits) {
      issues.push(`phone_mismatch:${profile.phone}!=${pageAudit.data.telLinks[0] || ''}`);
    }

    const socialChecks = [
      ['instagram', profile.instagram, pageAudit.data.instagramHref],
      ['facebook', profile.facebook, pageAudit.data.facebookHref],
      ['website', profile.website, pageAudit.data.websiteHref],
    ];

    for (const [label, expected, actual] of socialChecks) {
      if (!expected && !actual) {
        continue;
      }
      if (!expected && actual) {
        issues.push(`${label}_unexpected_present:${actual}`);
        continue;
      }
      if (expected && !actual) {
        issues.push(`${label}_missing_on_page`);
        continue;
      }
      if (!urlLooselyMatches(expected, actual)) {
        issues.push(`${label}_mismatch:${expected}!=${actual}`);
      }
    }

    for (const runtimeIssue of pageAudit.issues) {
      issues.push(runtimeIssue);
    }

    results.push({
      slug: entry.slug,
      url: deploy.url,
      status: issues.length ? 'fail' : 'pass',
      reportName: entry.reportName,
      expectedName,
      pageName: pageAudit.data.navBrand,
      expectedPhone: profile.phone,
      pagePhone: pageAudit.data.telLinks[0] || '',
      issues: issues.join(' | ') || 'ok',
    });
  }

  await browser.close();

  const ts = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
  const outCsv = path.join(reportsDir, `identity_verification_${ts}.csv`);
  const outMd = path.join(reportsDir, `identity_verification_${ts}.md`);

  const header = 'slug,url,status,report_name,expected_name,page_nav_name,expected_phone,page_phone,issues';
  const rows = results.map((row) => {
    const safe = (value) => String(value || '').replaceAll('"', "''");
    return [
      row.slug,
      row.url,
      row.status,
      `"${safe(row.reportName)}"`,
      `"${safe(row.expectedName)}"`,
      `"${safe(row.pageName)}"`,
      `"${safe(row.expectedPhone)}"`,
      `"${safe(row.pagePhone)}"`,
      `"${safe(row.issues)}"`,
    ].join(',');
  });
  fs.writeFileSync(outCsv, `${header}\n${rows.join('\n')}\n`, 'utf8');

  const pass = results.filter((row) => row.status === 'pass').length;
  const fail = results.length - pass;
  const failedRows = results.filter((row) => row.status === 'fail');

  const md = [
    `# Identity Verification (${new Date().toISOString()})`,
    '',
    `- source deploy report: ${deployCsv.name}`,
    `- total checked: ${results.length}`,
    `- pass: ${pass}`,
    `- fail: ${fail}`,
    '',
    '## Failed items',
    ...(failedRows.length
      ? failedRows.map((row) => `- ${row.slug} -> ${row.url} | ${row.issues}`)
      : ['- none']),
  ].join('\n');
  fs.writeFileSync(outMd, md, 'utf8');

  console.log(`VERIFY_DONE total=${results.length} pass=${pass} fail=${fail}`);
  console.log(`CSV=${outCsv}`);
  console.log(`MD=${outMd}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
