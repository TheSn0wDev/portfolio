export type SuggestedQuestion = {
  question: string
}

export const suggestedQuestions: SuggestedQuestion[] = [
  { question: 'Quelle est ton expertise ?' },
  { question: 'Quels projets GenAI as-tu réalisés ?' },
  { question: 'Sur quoi as-tu travaillé chez Thales ?' },
  { question: 'Quel type de mission recherches-tu ?' },
]

export const fallbackAnswer =
  'Je ne peux pas répondre à celle-ci pour le moment. [Tu peux contacter Clément](#contact).'

// Contexte CV utilisé comme base de connaissance par défaut pour /api/chat,
// en attendant le branchement du pipeline RAG (src/lib/rag).
export const cvContext = [
  'Clément Ozor, Software Engineer Backend & GenAI, Île-de-France. Recherche une mission longue en GenAI Engineering, hybride, via portage salarial. Email : clement.ozor@protonmail.com.',
  'Backend Software Engineer, Thales Gennevilliers (octobre 2025 – aujourd’hui) : services backend en Go sur la Combat Digital Platform ; passerelle d’interopérabilité entre protocoles OTAN JDSS et MIM ; composants d’intégration pour systèmes distribués ; conception technique, revues de code, tests, CI. Stack : Go, Java, Python, Docker, GitLab CI, PostgreSQL.',
  'Robotics Software Engineer, Thales Gennevilliers (mars – septembre 2025) : full-stack et intégration logicielle de systèmes robotiques pour le Challenge CoHoMa III ; chaîne de streaming vidéo temps réel et replay ; agrégation et visualisation de flux vidéo et multi-capteurs ; intégration logiciel/matériel. Stack : C++, C, Python, Docker, Hardware.',
  'Software Engineer, Thales Vélizy (avril – juillet 2023) : environnement Code Sandbox pour tester un SDK cartographique web ; tests de performance et benchmarks. Stack : TypeScript, JavaScript.',
  'Projet Personal RAG : architecture RAG complète (ingestion, chunking, embeddings, retrieval, génération), agents orchestrés avec LangGraph, évaluation du retrieval et gestion des sources, déploiement conteneurisé. Python, LangChain, LangGraph, pgvector, Docker.',
  'Projet MMA Scan, SaaS d’analyse MMA : plateforme d’analyse de combats exploitant une base de combattants et de statistiques ; développement full-stack ; chatbot RAG en cours pour interroger la base en langage naturel. Next.js, TypeScript, PostgreSQL, Python, LLM/RAG.',
  'Compétences : Go, Python, TypeScript, Node.js, REST APIs, WebSocket ; LLM, prompt engineering, RAG, LangChain, LangGraph, agents IA, bases vectorielles ; React, Next.js ; PostgreSQL, MongoDB, Redis ; Docker, Git, CI/CD, AWS, GCP, Kubernetes ; architecture logicielle, systèmes distribués, Agile/Scrum.',
  'Formation : Epitech Montpellier, Expert en Technologies de l’Information (2025) ; Université Laval, Québec, programme international en technologies de l’information (2024).',
  'Intérêts : robotique, électronique, IA, sports mécaniques, sports de combat, course à pied.',
].join('\n')

export const systemPrompt =
  'Tu es l’assistant du portfolio de Clément Ozor. Réponds en français, à la première personne comme si tu étais Clément, en 2 ou 3 phrases maximum, sans markdown ni listes. Utilise uniquement les informations ci-dessous. Si la réponse n’y figure pas, dis-le simplement et propose de m’écrire à clement.ozor@protonmail.com.'

export function buildPrompt(question: string): string {
  return `${systemPrompt}\n\nCV :\n${cvContext}\n\nQuestion du visiteur : ${question}`
}
