// Utilitários compartilhados pelos gates de CI que inspecionam o build em dist/.
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const { default: config } = await import('../astro.config.mjs');

export const DIST = 'dist';
/** `base` do astro.config.mjs, sempre com barra final (ex.: `/Portfolio/`). */
export const BASE = `${(config.base ?? '/').replace(/\/$/, '')}/`;
/** Origem + base do site publicado (ex.: `https://usuario.github.io/Portfolio/`). */
export const SITE_ROOT = new URL(BASE, config.site).href;

export function listFiles(dir = DIST) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? listFiles(path) : [path];
  });
}

/** Extrai URLs de href, src, srcset e de `content` absoluto do próprio site (og:image). */
export function extractRefs(html) {
  const refs = [];
  for (const [, attr, value] of html.matchAll(/\s(href|src|srcset|content)="([^"]*)"/g)) {
    if (attr === 'srcset') {
      refs.push(...value.split(',').map((candidate) => candidate.trim().split(/\s+/)[0]));
    } else if (attr !== 'content' || value.startsWith(SITE_ROOT)) {
      refs.push(value);
    }
  }
  return refs.filter(Boolean);
}

/**
 * Converte uma URL interna no arquivo correspondente em dist/.
 * Retorna `null` para URLs externas e `undefined` para internas fora do `base`.
 */
export function resolveInternal(ref) {
  let path = ref.startsWith(SITE_ROOT) ? BASE + ref.slice(SITE_ROOT.length) : ref;
  if (!path.startsWith('/') || path.startsWith('//')) return null;
  path = path.replace(/[?#].*$/, '');
  if (!path.startsWith(BASE) && `${path}/` !== BASE) return undefined;
  const relative = decodeURIComponent(path.slice(BASE.length));
  const file = join(DIST, relative);
  if (relative === '' || relative.endsWith('/')) return join(file, 'index.html');
  return existsSync(file) ? file : join(file, 'index.html');
}
