// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Cenário padrão: site de projeto em https://euuuller.github.io/Portfolio/.
// Com domínio próprio ou repositório `euuuller.github.io`: troque `site` pela
// URL final e remova `base` (o site passa a ser servido na raiz).
export default defineConfig({
  site: 'https://euuuller.github.io',
  base: '/Portfolio',
  output: 'static',
  // GitHub Pages serve diretórios com barra final; evita URL duplicada no sitemap.
  trailingSlash: 'always',
  build: {
    // CSS único e pequeno: inline elimina a requisição render-blocking (LCP).
    inlineStylesheets: 'always',
  },
  // Sem script de prefetch no cliente (0 KB de JS por padrão).
  prefetch: false,
  integrations: [sitemap()],
  vite: {
    // Tailwind v4 via plugin Vite oficial (@astrojs/tailwind é só para v3).
    plugins: [tailwindcss()],
  },
});
