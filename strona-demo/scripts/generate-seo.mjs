import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

function parseEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return {};
  }

  const content = readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const out = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const equals = trimmed.indexOf('=');
    if (equals === -1) {
      continue;
    }

    const key = trimmed.slice(0, equals).trim();
    let value = trimmed.slice(equals + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }

  return out;
}

const cwd = process.cwd();
const envProd = parseEnvFile(resolve(cwd, '.env.production'));
const envLocal = parseEnvFile(resolve(cwd, '.env.local'));
const envBase = parseEnvFile(resolve(cwd, '.env'));

const siteMode = (
  process.env.VITE_SITE_MODE ||
  envProd.VITE_SITE_MODE ||
  envLocal.VITE_SITE_MODE ||
  envBase.VITE_SITE_MODE ||
  'demo'
).toLowerCase();

const siteUrl = (
  process.env.VITE_SITE_URL ||
  envProd.VITE_SITE_URL ||
  envLocal.VITE_SITE_URL ||
  envBase.VITE_SITE_URL ||
  'https://demo-biuro-rachunkowe.local'
).replace(/\/$/, '');

const isProd = siteMode === 'prod';

const routes = [
  '/',
  '/o-nas',
  '/wiedza',
  '/pelna-ksiegowosc',
  '/kpir-ryczalt',
  '/kadry-zus',
  '/obsluga-ksef',
  '/doradztwo-podatkowe',
  '/sprawozdania',
  '/polityka-prywatnosci',
  '/regulamin',
];

const publicDir = resolve(process.cwd(), 'public');
mkdirSync(publicDir, { recursive: true });

const robots = isProd
  ? `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
  : `User-agent: *\nDisallow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;

const sitemapEntries = routes
  .map((route) => {
    const loc = route === '/' ? `${siteUrl}/` : `${siteUrl}${route}`;
    const priority = route === '/' ? '1.0' : route === '/polityka-prywatnosci' || route === '/regulamin' ? '0.3' : '0.8';
    const changefreq = route === '/' ? 'weekly' : route === '/polityka-prywatnosci' || route === '/regulamin' ? 'yearly' : 'monthly';

    return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`;

writeFileSync(resolve(publicDir, 'robots.txt'), robots, 'utf8');
writeFileSync(resolve(publicDir, 'sitemap.xml'), sitemap, 'utf8');

console.log(`SEO files generated for mode: ${siteMode}`);
