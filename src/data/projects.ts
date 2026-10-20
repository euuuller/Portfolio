// Fonte de dados dos projetos exibidos na home. Ordem do array = ordem na página.
export interface Project {
  title: string;
  description: string;
  tech: string[];
  /**
   * Prefixo do arquivo em `public/images/`. O card espera duas larguras:
   * `<image>-640.webp` e `<image>-1280.webp`, ambas em 16:10.
   */
  image: string;
  imageAlt: string;
  repoUrl?: string;
  liveUrl?: string;
}

export const projects: Project[] = [
  {
    title: 'Projeto Exemplo 1',
    description: 'Descrição curta do problema resolvido e do resultado obtido (1 a 2 frases).',
    tech: ['TypeScript', 'Astro', 'Tailwind CSS'],
    image: 'projeto-exemplo-1',
    imageAlt: 'Captura de tela provisória do Projeto Exemplo 1',
    repoUrl: 'https://github.com/euuuller',
  },
  {
    title: 'Projeto Exemplo 2',
    description: 'Descrição curta do problema resolvido e do resultado obtido (1 a 2 frases).',
    tech: ['Node.js', 'PostgreSQL'],
    image: 'projeto-exemplo-2',
    imageAlt: 'Captura de tela provisória do Projeto Exemplo 2',
    repoUrl: 'https://github.com/euuuller',
  },
  {
    title: 'Projeto Exemplo 3',
    description: 'Descrição curta do problema resolvido e do resultado obtido (1 a 2 frases).',
    tech: ['Python', 'Docker'],
    image: 'projeto-exemplo-3',
    imageAlt: 'Captura de tela provisória do Projeto Exemplo 3',
    repoUrl: 'https://github.com/euuuller',
  },
];
