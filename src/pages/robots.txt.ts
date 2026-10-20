// robots.txt gerado no build a partir de `site` + `base` (astro.config.mjs).
// Crawlers só leem /robots.txt na raiz do domínio: em site de projeto
// (`usuario.github.io/repo`) este arquivo só passa a valer com domínio próprio.
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(`${import.meta.env.BASE_URL.replace(/\/$/, '')}/sitemap-index.xml`, site);
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap.href}\n`);
};
