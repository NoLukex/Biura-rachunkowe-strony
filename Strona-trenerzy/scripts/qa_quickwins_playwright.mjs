import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const reportsDir = path.join(root, 'reports');

const latestQuickWinReport = fs
  .readdirSync(reportsDir)
  .filter((name) => /^redeploy_quickwins_\d{8}_\d{6}\.csv$/.test(name))
  .sort()
  .pop();

if (!latestQuickWinReport) {
  console.error('Brak pliku redeploy_quickwins_*.csv w reports/.');
  process.exit(1);
}

const csvPath = path.join(reportsDir, latestQuickWinReport);
const csvLines = fs.readFileSync(csvPath, 'utf8').trim().split(/\r?\n/);
const records = csvLines.slice(1).map((line) => {
  const parts = line.split(',');
  return {
    slug: parts[0],
    project: parts[1],
    status: parts[2],
    url: parts[3],
  };
});

const expectedTextBySlug = {
  'arkadiusz-czajkowski-trener-personalny': 'Pozbadz sie bolu plecow',
  'bartosz-jaszczak-trener-personalny-bydgoszcz': 'Quiz: wybierz typ treningu',
  'bartosz-trzebiatowski-trener-personalny': 'Dla kogo ktory program',
  'bartosz-tywusik-trener-personalny': 'Ankieta bolu',
  'damian-piskorz': 'Sciezka sport / kickboxing',
  'daria-petla-trener-personalny': 'Jeden cel: stabilny progres',
  'dietetyk-bydgoszcz-tomasz-giza': 'Automatyczny follow-up',
  'jakub-stypczynski-trener-personalny-bydgoszcz': 'Umow konsultacje',
  'kaja-narkun': 'Oddzwonie dzis',
  'lukasz-dziennik-atletyczna-sila': '3 przyklady obok pakietow',
  'maciej-karolczyk-trener-personalny': 'Formularz Kwalifikacyjny',
  'maja-burek-trener-personalny': 'Dla kogo ktory program',
  'mateusz-mazur': '3 przyklady obok pakietow',
  'mikolaj-karaszewski-fitness-lifestyle': 'Program 90 dni',
  'norbert-lysiak-trener-osobisty-triathlon-mtb-plywanie': 'Kalkulator sezonu',
  'oskar-kaliszewski-trener-personalny': 'Wybierz swoj tor wspolpracy',
  'patryk-kozikowski': 'Najblizsze wolne terminy',
  'patryk-michalek-trener-personalny': 'Pierwsze 30 dni wspolpracy',
  'trener-personalny-bydgoszcz-nicolas-marysiak': 'Formularz Kwalifikacyjny',
  'trener-personalny-kamil-makowski': 'Osobno: bol/kontuzja i sylwetka',
  'trener-personalny-szymon-idzinski': 'Jak wyglada pierwsza sesja',
  'trener-radoslaw-habera': 'CTA podpiete pod wpisy',
  'wiktoria-wasik': 'Jeden cel: stabilny progres',
};

const mobileStickyExpectations = {
  'jakub-stypczynski-trener-personalny-bydgoszcz': '15 min',
  'kaja-narkun': 'Oddzwonie dzis',
  'norbert-lysiak-trener-osobisty-triathlon-mtb-plywanie': 'Konsultacja 60',
};

const run = async () => {
  const browser = await chromium.launch({ headless: true });
  const output = [];

  for (const row of records) {
    const errors = [];
    if (!row.url) {
      output.push({ ...row, qa: 'fail', details: 'Brak URL w raporcie deployu' });
      continue;
    }

    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    page.on('pageerror', (error) => errors.push(`pageerror:${error.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!/favicon|Failed to load resource/i.test(text)) {
          errors.push(`console:${text}`);
        }
      }
    });

    try {
      const response = await page.goto(row.url, { waitUntil: 'networkidle', timeout: 45000 });
      if (!response || !response.ok()) {
        errors.push(`http:${response ? response.status() : 'no-response'}`);
      }

      await page.waitForSelector('#contact', { timeout: 15000 });
      await page.waitForSelector('#pricing', { timeout: 15000 });
      await page.waitForSelector('#faq', { timeout: 15000 });

      const expectedText = expectedTextBySlug[row.slug];
      if (expectedText) {
        const textFound = await page.getByText(expectedText, { exact: false }).first().isVisible().catch(() => false);
        if (!textFound) {
          errors.push(`missing-text:${expectedText}`);
        }
      }

      const stickyExpected = mobileStickyExpectations[row.slug];
      if (stickyExpected) {
        const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
        const mobilePage = await mobileContext.newPage();
        await mobilePage.goto(row.url, { waitUntil: 'networkidle', timeout: 45000 });
        const mobileFound = await mobilePage.getByText(stickyExpected, { exact: false }).first().isVisible().catch(() => false);
        if (!mobileFound) {
          errors.push(`missing-mobile-text:${stickyExpected}`);
        }
        await mobileContext.close();
      }
    } catch (error) {
      errors.push(`exception:${error instanceof Error ? error.message : String(error)}`);
    }

    await context.close();
    output.push({
      ...row,
      qa: errors.length === 0 ? 'pass' : 'fail',
      details: errors.join(' | ') || 'ok',
    });
  }

  await browser.close();

  const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
  const outCsv = path.join(reportsDir, `qa_quickwins_playwright_${timestamp}.csv`);
  const outMd = path.join(reportsDir, `qa_quickwins_playwright_${timestamp}.md`);

  const csvHeader = 'slug,project,status,url,qa,details';
  const csvBody = output
    .map((row) => {
      const safeDetails = row.details.replaceAll('"', "''");
      return `${row.slug},${row.project},${row.status},${row.url},${row.qa},"${safeDetails}"`;
    })
    .join('\n');
  fs.writeFileSync(outCsv, `${csvHeader}\n${csvBody}\n`, 'utf8');

  const passed = output.filter((row) => row.qa === 'pass').length;
  const failed = output.length - passed;
  const md = [
    `# QA Quick Wins (${new Date().toISOString()})`,
    '',
    `- source deploy report: ${latestQuickWinReport}`,
    `- total: ${output.length}`,
    `- pass: ${passed}`,
    `- fail: ${failed}`,
    '',
    '## Failures',
    ...output
      .filter((row) => row.qa === 'fail')
      .map((row) => `- ${row.slug} -> ${row.url} | ${row.details}`),
  ].join('\n');
  fs.writeFileSync(outMd, md, 'utf8');

  console.log(`QA_DONE total=${output.length} pass=${passed} fail=${failed}`);
  console.log(`CSV=${outCsv}`);
  console.log(`MD=${outMd}`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
