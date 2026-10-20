// Metadados globais do site. Consumido por BaseLayout (SEO, JSON-LD) e pelos componentes.
export interface SocialLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  jobTitle: string;
  description: string;
  email: string;
  /** Texto alternativo do avatar; vazio enquanto ele for só um monograma decorativo. */
  avatarAlt: string;
  /** Ferramentas exibidas na seção Sobre. */
  skills: string[];
  locale: string;
  /** Caminho relativo a `public/`, sem barra inicial. */
  ogImage: string;
  ogImageAlt: string;
  /** Caminho do currículo em `public/docs/`; omitido até o PDF existir. */
  resumePath?: string;
  social: SocialLink[];
}

export const site: SiteConfig = {
  name: 'Euller dos Santos R. Duarte',
  jobTitle: 'Análise e Ciência de Dados',
  description:
    'Portfólio de Euller dos Santos R. Duarte, graduando em Engenharia Elétrica com foco em Análise e Ciência de Dados: projetos de machine learning, dados e BI.',
  email: 'Euller.Santos.Duarte@gmail.com',
  avatarAlt: '',
  skills: [
    'Python',
    'Polars',
    'Pandas',
    'NumPy',
    'Scikit-learn',
    'Matplotlib',
    'Jupyter',
    'Hugging Face',
    'SQL',
    'PostgreSQL',
    'dbt',
    'Databricks',
    'BigQuery',
    'Power BI',
    'Looker',
    'Docker',
    'Git',
    'Linux',
  ],
  locale: 'pt_BR',
  ogImage: 'images/og-image.jpg',
  ogImageAlt: 'Euller dos Santos R. Duarte, Análise e Ciência de Dados',
  // resumePath: 'docs/curriculo-euller-duarte.pdf',
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
