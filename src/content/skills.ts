export type SkillGroup = {
  title: string
  variant: 'dark' | 'light' | 'surface'
  titleFont?: 'hand'
  chipVariant?: 'default' | 'dark' | 'white'
  chips: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'GenAI',
    variant: 'dark',
    chipVariant: 'dark',
    chips: ['LLM', 'Prompt Engineering', 'RAG', 'LangChain', 'LangGraph', 'Agents IA', 'ChromaDB', 'Recherche hybride', 'Reranking'],
  },
  {
    title: 'Backend',
    variant: 'light',
    chips: ['Go', 'Python', 'TypeScript', 'Node.js', 'FastAPI', 'REST APIs', 'WebSocket'],
  },
  {
    title: 'Cloud & DevOps',
    variant: 'light',
    chips: ['Docker', 'Git', 'GitLab CI', 'GitHub Actions', 'Kubernetes', 'AWS', 'GCP'],
  },
  {
    title: 'Engineering',
    variant: 'light',
    chips: ['Architecture logicielle', 'APIs', 'Systèmes distribués', 'Interopérabilité', 'Vitest', 'Tests de performance', 'Agile / Scrum'],
  },
  {
    title: 'Data',
    variant: 'light',
    chips: ['PostgreSQL', 'MongoDB', 'Redis'],
  },
  {
    title: 'Frontend',
    variant: 'light',
    chips: ['React', 'Next.js'],
  },
  {
    title: 'Robotique & embarqué',
    variant: 'light',
    chips: ['C', 'C++', 'Intégration logicielle et matérielle', 'Streaming vidéo', 'Données multi-capteurs'],
  },
  {
    title: 'En dehors du code…',
    variant: 'surface',
    titleFont: 'hand',
    chipVariant: 'white',
    chips: ['Robotique', 'Électronique', 'IA', 'Sports mécaniques', 'Sports de combat', 'Course à pied'],
  },
]
