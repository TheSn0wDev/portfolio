export type TextSegment = {
  text: string
  emphasis?: 'strong' | 'sky'
}

export const accent = '#2563EB'

export const heroChips = ['Île-de-France', 'Mission longue · hybride', 'Portage salarial']

export const name = {
  line1: 'CLÉMENT',
  line2: 'OZOR',
}

export const eyebrow = 'Software Engineer | Backend & GenAI'

export const handwrittenTagline = ['Build GenAI', 'for real-world impact']

export const pitch: TextSegment[] = [
  { text: 'Je développe des services backend en ' },
  { text: 'Go chez Thales', emphasis: 'strong' },
  { text: ', sur la Combat Digital Platform. Mes projets personnels explorent les assistants documentaires, les LLM et l’analyse de données, de l’API à l’interface produit.' },
]

export const availability = 'Disponible début 2027'

export const currentRole = {
  label: 'Actuellement',
  description: 'Backend Software Engineer chez Thales, sur les services Go de la Combat Digital Platform',
}

export const heroCtas = {
  primary: { label: 'Voir mes projets', href: '#projets' },
  secondary: { label: 'Discutons d’une mission', href: '#contact' },
  contact: { label: 'Me contacter', href: '#contact' },
}

export const techMarquee = [
  'Go',
  'Python',
  'TypeScript',
  'LangGraph',
  'LangChain',
  'ChromaDB',
  'PostgreSQL',
  'Docker',
  'GitLab CI',
  'Next.js',
  'C++',
  'Kubernetes',
]

export const contactHeading: TextSegment[] = [
  { text: 'Un projet backend ou GenAI Engineering ? ' },
  { text: 'Parlons-en.', emphasis: 'sky' },
]

export const footerTagline = 'build GenAI for real-world impact'
export const footerCopyright = '© 2026 Clément Ozor | Software Engineer Backend & GenAI'
