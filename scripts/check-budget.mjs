// Gate de CI: orçamento de peso do build. Sai com código 1 se algum limite estourar.
import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { DIST, extractRefs, listFiles, resolveInternal } from './dist.mjs';

const KB = 1024;
const BUDGET = {
  jsGzip: 5 * KB, // meta: 0 KB; exceção justificada até 5 KB
  cssGzip: 20 * KB,
  homeTransfer: 500 * KB,
  distTotal: 1024 * KB * KB, // limite do GitHub Pages: 1 GB
};

const gzipSize = (buffer) => gzipSync(buffer, { level: 9 }).length;
const files = listFiles();

const jsGzip = files.filter((f) => f.endsWith('.js')).reduce((sum, f) => sum + gzipSize(readFileSync(f)), 0);

const homeHtml = readFileSync(join(DIST, 'index.html'), 'utf8');
const inlineCss = [...homeHtml.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('');
const homeAssets = new Set(
  extractRefs(homeHtml)
    .map(resolveInternal)
    .filter((file) => file && !file.endsWith('.html') && !file.endsWith('.xml')),
);
const linkedCss = [...homeAssets].filter((f) => f.endsWith('.css'));
const cssGzip = gzipSize(Buffer.from(inlineCss)) + linkedCss.reduce((sum, f) => sum + gzipSize(readFileSync(f)), 0);

// Pior caso: soma todos os candidatos de srcset e todo asset referenciado pela home.
const textual = /\.(css|js|svg|txt|json)$/;
const homeTransfer =
  gzipSize(Buffer.from(homeHtml)) +
  [...homeAssets].reduce((sum, f) => sum + (textual.test(f) ? gzipSize(readFileSync(f)) : statSync(f).size), 0);

const distTotal = files.reduce((sum, f) => sum + statSync(f).size, 0);

const results = [
  ['JS no cliente (gzip, dist inteiro)', jsGzip, BUDGET.jsGzip],
  ['CSS da home (gzip)', cssGzip, BUDGET.cssGzip],
  ['Peso transferido da home (pior caso)', homeTransfer, BUDGET.homeTransfer],
  ['Tamanho total do dist', distTotal, BUDGET.distTotal],
];

let failed = false;
for (const [label, size, limit] of results) {
  const ok = size <= limit;
  failed ||= !ok;
  console.log(`${ok ? '✓' : '✗'} ${label}: ${(size / KB).toFixed(1)} KB (limite ${(limit / KB).toFixed(0)} KB)`);
}
if (jsGzip > 0) console.warn('! Há JavaScript no build: a meta é 0 KB; justifique a exceção no PR.');
process.exit(failed ? 1 : 0);
