// @ts-check
import { defineConfig } from 'astro/config';

// Cenário padrão: site de projeto em https://euuuller.github.io/Portfolio/.
// Com domínio próprio ou repositório `euuuller.github.io`: troque `site` pela
// URL final e remova `base` (o site passa a ser servido na raiz).
export default defineConfig({
  site: 'https://euuuller.github.io',
  base: '/Portfolio',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    // CSS único e pequeno: inline elimina a requisição render-blocking (LCP).
    inlineStylesheets: 'always',
  },
  // Sem script de prefetch no cliente (0 KB de JS por padrão).
  prefetch: false,
});
