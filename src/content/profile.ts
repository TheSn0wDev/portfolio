export type TextSegment = {
  text: string
  emphasis?: 'strong' | 'sky'
}

export const accent = '#2563EB'

export const heroChips = ['Île-de-France', 'Mission longue', 'Portage salarial']

export const name = {
  line1: 'CLÉMENT',
  line2: 'OZOR',
}

export const eyebrow = 'Développeur backend & IA générative'

export const handwrittenTagline = ['Agents IA autonomes', 'pour des usages concrets']

export const pitch: TextSegment[] = [
  { text: 'Je développe des services backend en ' },
  { text: 'Go chez Thales', emphasis: 'strong' },
  { text: ', sur la Combat Digital Platform. Mes projets personnels portent sur les assistants documentaires RAG et les agents IA autonomes : orchestration, utilisation d’outils et exécution d’actions avec permissions, budgets et validations.' },
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

// Shared by every contact surface; keep engagement terms in one place.
export const engagementSummary = {
  fr: 'Mission backend ou GenAI de six mois minimum via portage salarial. Disponible début 2027 : présentiel en Île-de-France, hybride ou télétravail intégral.',
  en: 'Backend or GenAI engagement of at least six months through a French umbrella company (portage salarial). Available early 2027: on-site in Île-de-France, hybrid or fully remote.',
}
