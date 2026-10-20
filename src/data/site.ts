// Metadados globais do site. Consumido por BaseLayout (SEO, JSON-LD) e pelos componentes.
export interface SocialLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  jobTitle: string;
  description: string;
  locale: string;
  /** Caminho relativo a `public/`, sem barra inicial. */
  ogImage: string;
  ogImageAlt: string;
  /** Caminho do currículo em `public/docs/`; omitido até o PDF existir. */
  resumePath?: string;
  social: SocialLink[];
}

export const site: SiteConfig = {
  name: 'Euller Santos Duarte',
  jobTitle: 'Desenvolvedor de Software',
  description:
    'Portfólio de Euller Santos Duarte: projetos, tecnologias e contato de um desenvolvedor de software.',
  locale: 'pt_BR',
  ogImage: 'images/og-image.jpg',
  ogImageAlt: 'Cartão com o texto Portfólio, Desenvolvedor de software',
  // resumePath: 'docs/curriculo-euller-santos-duarte.pdf',
  social: [{ label: 'GitHub', href: 'https://github.com/euuuller' }],
};

/**
 * Prefixa um caminho interno com o `base` do astro.config.mjs.
 * Necessário em sites de projeto do GitHub Pages (`/Portfolio/...`);
 * com domínio próprio (`base` ausente) devolve o caminho na raiz.
 */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}
