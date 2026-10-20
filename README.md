# Portfolio

Portfólio pessoal estático em pt-BR, gerado com **Astro 7 (SSG)** + **Tailwind CSS v4** e publicado no **GitHub Pages**. O site envia **0 KB de JavaScript** ao cliente.

Fluxo: código-fonte → `astro build` (SSG) → `dist/` estático → GitHub Pages.

## Requisitos

- Node.js ≥ 22.22 (exigência do Astro 7). O `.nvmrc` fixa o Node 24 LTS, a mesma versão do CI.
- npm. O `package-lock.json` é a fonte de verdade das versões.

## Comandos

| Comando | Ação |
| --- | --- |
| `npm ci` | Instala as dependências exatas do lockfile |
| `npm run dev` | Servidor de desenvolvimento em `http://localhost:4321/Portfolio/` |
| `npm run check` | Type-check (`astro check`) de `.astro` e `.ts` |
| `npm run build` | Gera o site em `dist/` |
| `npm run preview` | Serve o `dist/` localmente |
| `node scripts/check-budget.mjs` | Gate de orçamento de peso (requer `dist/`) |
| `node scripts/check-links.mjs` | Gate de links internos e âncoras (requer `dist/`) |

## Estrutura

| Caminho | Responsabilidade |
| --- | --- |
| `.github/workflows/deploy.yml` | CI/CD: gates de qualidade em PR e push; deploy só a partir da `main` |
| `public/` | Arquivos copiados sem processamento e **sem hash** (favicon, imagens, PDFs) |
| `public/images/` | Avatar, capas de projeto (WebP) e imagem Open Graph (JPEG 1200×630) |
| `public/docs/` | Currículo em PDF (nome estável, ≤ 500 KB, PDF com texto selecionável e tags) |
| `src/components/` | Componentes `.astro` estáticos: `Navbar`, `Footer`, `ProjectCard`, `TechBadge` |
| `src/layouts/BaseLayout.astro` | `<head>` completo (SEO, OG, Twitter Card, JSON-LD `Person`), skip link e landmarks; único importador do CSS global |
| `src/styles/global.css` | Único CSS de entrada: `@import "tailwindcss"`, tokens em `@theme`, fonte e temas |
| `src/pages/` | Rotas: `index.astro`, `404.astro` e `robots.txt.ts` |
| `src/data/` | `site.ts` (metadados, redes, helper `url()`) e `projects.ts` (lista de projetos) |
| `scripts/` | Gates de CI sem dependências que leem `dist/` |
| `astro.config.mjs` | `output: 'static'`, `site`/`base`, Tailwind via Vite, sitemap |
| `tailwind.config.mjs` | Configuração JS **legada**, não carregada (ver Decisões) |
| `lighthouserc.json` | Asserções do Lighthouse CI |

## Editar conteúdo

- **Dados pessoais e redes:** `src/data/site.ts`.
- **Projetos:** `src/data/projects.ts`. Para cada projeto, crie `public/images/<image>-640.webp` e `<image>-1280.webp` em 16:10, até 60 KB e 120 KB respectivamente.
- **Avatar:** substitua `public/images/avatar-160.webp` e `avatar-320.webp` (quadrados, ≤ 20 KB).
- **Currículo:** adicione o PDF em `public/docs/` e descomente `resumePath` em `site.ts`. O botão só aparece com o campo preenchido.
- **Imagem Open Graph:** `public/images/og-image.jpg`, 1200×630, ≤ 150 KB.

O avatar atual é um monograma provisório (com `avatarAlt` vazio, por ser decorativo) e as capas dos projetos são geradas. Mantenha nomes e dimensões ao substituí-los: o HTML declara `width` e `height` fixos para evitar CLS.

Os arquivos em `public/` não recebem hash. Ao trocar uma imagem, o navegador pode servir a versão antiga até o cache expirar (o GitHub Pages usa `max-age=600`). Use um nome novo quando a atualização precisar ser imediata.

## Decisões

| Tema | Escolha | Descartado e motivo |
| --- | --- | --- |
| Versão do Astro | 7.x (estável desde 22/06/2026) | 6.x: major anterior, sem ganho para um projeto novo |
| Tailwind | v4 via `@tailwindcss/vite`, tokens em `@theme` | `@astrojs/tailwind`: depreciada, só v3 |
| `tailwind.config.mjs` | Mantido como ponto de extensão, **não carregado** | Duplicar tokens em JS: duas fontes de verdade. Ative com `@config` só para plugin JS legado |
| CSS | `build.inlineStylesheets: 'always'` (3,4 KB gzip) | `auto`: inline só abaixo de 4 KB; o CSS cresce e vira requisição render-blocking (LCP) |
| Tema escuro | `prefers-color-scheme`, sem toggle | Toggle exige JS e script bloqueante anti-FOUC |
| Navegação | 3 âncoras sem menu hambúrguer | Menu colapsável exige JS ou hacks de checkbox |
| Prefetch / `<ClientRouter />` | Desligados | Ambos injetam JS no cliente |
| Fonte | Inter variável auto-hospedada, só subset latino, preload único | Google Fonts: conexão extra a terceiros, render-blocking |
| Imagens | `public/` + `srcset` manual | `astro:assets` (`src/assets/`): gera AVIF/WebP e hash automaticamente, mas foge da estrutura-base |
| Pipeline | `setup-node` + `npm ci` + `upload-pages-artifact` | `withastro/action`: usa `npm install` (não reproduzível) e publica o artefato antes dos gates |
| `trailingSlash` | `'always'` | `'ignore'`: o sitemap listava `/Portfolio` e `/Portfolio/` |

## Publicação

**Configuração única:** em *Settings → Pages*, selecione *Source = GitHub Actions*.

**URL:** o padrão é site de projeto (`https://euuuller.github.io/Portfolio/`), com `site` + `base` no `astro.config.mjs`. Para usar domínio próprio ou um repositório `euuuller.github.io`, troque `site` pela URL final e remova `base`. Todos os links internos passam por `url()` (`src/data/site.ts`) e se ajustam sozinhos.

`robots.txt` só tem efeito na raiz do domínio. Em site de projeto, ele é gerado mas ignorado pelos crawlers. O sitemap continua acessível pelo `<link rel="sitemap">`.

### Pipeline (`.github/workflows/deploy.yml`)

1. **Gatilho:** push na `main`, PR para `main` (só verificação) ou `workflow_dispatch`.
2. **build:** `npm ci` → gates → upload do artefato do Pages (somente na `main`).
3. **deploy:** `actions/deploy-pages` no environment `github-pages`, que publica o artefato inteiro de uma vez (deploy atômico).
4. **Verificação pós-deploy:** `curl` na URL publicada confere o `<html lang="pt-BR">` e a existência do sitemap.

| Gate | Bloqueia deploy? | Ferramenta |
| --- | --- | --- |
| Type-check | Sim | `astro check` |
| Build | Sim | `astro build` |
| Orçamento: JS ≤ 5 KB, CSS ≤ 20 KB, home ≤ 500 KB, `dist` ≤ 1 GB | Sim | `scripts/check-budget.mjs` |
| Links internos, `base` e âncoras | Sim | `scripts/check-links.mjs` |
| Lighthouse: Accessibility, Best Practices, SEO ≥ 95; CLS ≤ 0,1 | Sim | `@lhci/cli` (3 execuções, mobile) |
| Lighthouse: Performance ≥ 95, LCP ≤ 2,5 s, TBT ≤ 200 ms | Não (aviso) | `@lhci/cli` |

Performance, LCP e TBT só geram aviso porque variam entre runners compartilhados. O peso, que é o que determina essas métricas, é bloqueado de forma determinística pelo orçamento. Os relatórios do Lighthouse ficam como artefato da execução por 14 dias.

**Limites do GitHub Pages:** `dist` ≤ 1 GB (verificado pelo orçamento) e deploy ≤ 10 min (os jobs têm `timeout-minutes: 10`).

**Concorrência:** builds do mesmo ref cancelam o anterior. Deploys entram na fila do grupo `pages` e nunca são cancelados no meio.

### Rollback

1. `git revert <commit>` na `main` e push. O pipeline publica a versão anterior com todos os gates.
2. Alternativa imediata: *Actions* → execução anterior bem-sucedida → *Re-run jobs*. Isso refaz o build a partir daquele commit.
