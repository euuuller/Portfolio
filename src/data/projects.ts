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

// Atividades da disciplina Fundamentos de Machine Learning (IFMA).
const notebooks = 'https://github.com/euuuller/Fundamentos-ML/blob/main/Notebooks/';

export const projects: Project[] = [
  {
    title: 'Câncer de mama: otimização de recall',
    description:
      'Classificador de diagnóstico ajustado para priorizar o recall e reduzir falsos negativos. Compara SGD, baseline Dummy e Random Forest.',
    tech: ['Python', 'Scikit-learn', 'Pandas', 'Jupyter'],
    image: 'ml-cancer-recall',
    imageAlt: 'Capa do projeto: classificação binária de câncer de mama com foco em recall',
    repoUrl: `${notebooks}Exercicio_01_Cancer_Recall.ipynb`,
  },
  {
    title: 'Titanic: previsão de sobrevivência',
    description:
      'Pré-processamento e classificação binária de passageiros, avaliada por curva ROC e AUC. Compara SGD, baseline Dummy e Random Forest.',
    tech: ['Python', 'Scikit-learn', 'Pandas', 'Matplotlib'],
    image: 'ml-titanic-sobrevivencia',
    imageAlt: 'Capa do projeto: previsão de sobrevivência no Titanic com ROC e AUC',
    repoUrl: `${notebooks}Exercicio_02_Titanic_Sobrevivencia.ipynb`,
  },
  {
    title: 'Vinhos: classificação multiclasse',
    description:
      'Classificação de três classes de vinho com estratégias OvR e OvO, SVC e Random Forest, avaliadas por métricas macro.',
    tech: ['Python', 'Scikit-learn', 'NumPy', 'Matplotlib'],
    image: 'ml-vinhos-multiclasse',
    imageAlt: 'Capa do projeto: classificação multiclasse de vinhos',
    repoUrl: `${notebooks}Exercicio_03_Wine_Multiclasse.ipynb`,
  },
];
