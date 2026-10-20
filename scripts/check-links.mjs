// Gate de CI: todo link/recurso interno do HTML gerado existe em dist/,
// respeita o `base` e, se tiver âncora, aponta para um id existente.
import { existsSync, readFileSync } from 'node:fs';
import { DIST, extractRefs, listFiles, resolveInternal } from './dist.mjs';

const pages = listFiles().filter((f) => f.endsWith('.html'));
const idsCache = new Map();
const idsOf = (file) => {
  if (!idsCache.has(file)) {
    idsCache.set(file, new Set([...readFileSync(file, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idsCache.get(file);
};

const errors = [];
let checked = 0;
for (const page of pages) {
  for (const ref of extractRefs(readFileSync(page, 'utf8'))) {
    const fragment = ref.includes('#') ? ref.slice(ref.indexOf('#') + 1) : '';
    const target = ref.startsWith('#') ? page : resolveInternal(ref);
    if (target === null) continue; // externo (http, mailto, ...)
    checked++;
    if (target === undefined) errors.push(`${page}: "${ref}" não usa o base do site`);
    else if (!existsSync(target)) errors.push(`${page}: "${ref}" não existe em ${DIST}/`);
    else if (fragment && target.endsWith('.html') && !idsOf(target).has(fragment)) {
      errors.push(`${page}: "${ref}" aponta para #${fragment}, inexistente`);
    }
  }
}

errors.forEach((error) => console.error(`✗ ${error}`));
console.log(`${errors.length ? '✗' : '✓'} ${checked} links internos verificados em ${pages.length} páginas`);
process.exit(errors.length ? 1 : 0);
