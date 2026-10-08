import { engagementSummary } from './profile'
import type { Locale } from '@/i18n/locale'

export type SeoSection = { heading: string; paragraphs: string[]; bullets?: string[] }
export type SeoPage = {
  slug: string
  title: string
  description: string
  label: string
  heading: string
  intro: string
  status: string
  // Handwritten note beside the hero, on two lines.
  tagline?: [string, string]
  // Part of the heading set in the accent color.
  highlight?: string
  // Key facts shown as a card in the hero.
  facts?: { label: string; value: string }[]
  stack: string[]
  sections: SeoSection[]
  links: { label: string; href: string }[]
}

// First-party sources: documents/profil.md, personal-rag.md and levelpilot.md.
// Keep translations together, and add a page only when it has its own evidence.
export const seoSlugs = ['personal-rag', 'agents-ia-autonomes', 'mission-genai'] as const
export const seoPages: Record<Locale, SeoPage[]> = {
  fr: [
    {
      slug: 'personal-rag', label: 'Assistants documentaires RAG',
      title: 'Développement RAG Python : Personal RAG | Clément Ozor',
      description: 'Découvrez Personal RAG : assistant documentaire Python avec recherche hybride, reranking et réponses sourcées. Architecture et réalisations de Clément Ozor.',
      heading: 'Personal RAG : un assistant documentaire qui cite ses sources',
      intro: 'Je développe Personal RAG pour interroger les documents d’un projet depuis un chat ou une API. Le système recherche des passages pertinents avant de générer une réponse contextualisée, avec des citations pour retrouver les sources.',
      status: 'Projet personnel en développement, intégré au portfolio et à MMA Scan.',
      tagline: ['Chaque réponse', 'cite ses sources'],
      stack: ['Python', 'FastAPI', 'LangChain', 'ChromaDB', 'OpenAI'],
      sections: [
        { heading: 'Un assistant réutilisable pour les documents d’un projet', paragraphs: ['Le besoin de départ est de mieux comprendre mes projets et de demander des conseils à partir de leur documentation. Personal RAG sépare la base documentaire, la recherche et la génération pour permettre la réindexation d’un autre corpus.', 'L’intégration au portfolio et à MMA Scan est confirmée. L’extension à mes autres projets reste un objectif. La stack de Personal RAG ne doit pas être confondue avec celle du backend de ce portfolio, qui possède sa propre implémentation.'] },
        { heading: 'De l’indexation à la réponse sourcée', paragraphs: ['L’indexation incrémentale utilise des empreintes SHA-256 pour repérer les changements. Les documents sont synchronisés avec un stockage vectoriel persistant afin de retrouver les passages utiles aux questions.'], bullets: ['Recherche sémantique avec seuil de pertinence.', 'Recherche hybride pour combiner les signaux de recherche.', 'Reranking et orchestration d’agents pour enrichir la pertinence.', 'Génération contextualisée avec citations et traçabilité des sources.'] },
        { heading: 'Ce que cette réalisation montre', paragraphs: ['Ce projet me permet de travailler sur une chaîne RAG complète : préparation du corpus, indexation, récupération du contexte et restitution dans une interface ou une API. Les citations permettent de vérifier les passages utilisés plutôt que de se fier uniquement au texte généré.', 'Une intégration en entreprise doit aussi cadrer les droits d’accès, la confidentialité du corpus, la fraîcheur des documents et le comportement lorsque les sources ne permettent pas de répondre. Ces exigences sont à définir pour chaque mission.'] },
        { heading: 'Évaluer la qualité avant de généraliser', paragraphs: ['Je propose de partir de questions représentatives et de passages attendus pour évaluer la recherche et les réponses. La pertinence, la fidélité aux sources, la latence et le coût doivent être mesurés ensemble.', 'Aucun benchmark chiffré n’est publié ici. Le dépôt permet d’examiner le projet ; les exemples visuels du portfolio illustrent le fonctionnement et ne constituent pas des résultats de production.'] },
      ],
      links: [{ label: 'Examiner le dépôt project-brain', href: 'https://github.com/TheSn0wDev/project-brain' }],
    },
    {
      slug: 'agents-ia-autonomes', label: 'Agents IA autonomes',
      title: 'Agents IA autonomes : backend LevelPilot | Clément Ozor',
      description: 'Agents IA autonomes et orchestration backend : découvrez LevelPilot, ses workflows asynchrones, permissions, tests, PR et rollbacks configurables.',
      heading: 'Agents IA autonomes : de l’analyse aux actions vérifiables',
      intro: 'Je développe le backend de LevelPilot avec un collègue chargé du frontend. Cette plateforme SaaS vise à aider les créateurs Roblox à améliorer leurs jeux à partir des données joueurs et d’agents IA dont le niveau d’autonomie est configurable.',
      status: 'LevelPilot est en développement. Aucun gain mesuré ni lancement en production n’est annoncé.',
      tagline: ['Autonomie', 'sous contrôle'],
      stack: ['TypeScript', 'Node.js', 'PostgreSQL', 'Prisma', 'pg-boss', 'Docker', 'OpenAI', 'Luau'],
      sections: [
        { heading: 'Une boucle d’amélioration fondée sur les données', paragraphs: ['La boucle visée est de mesurer les comportements joueurs, analyser les indicateurs, identifier une opportunité, préparer une modification, la tester puis mesurer son impact. Les objectifs concernent la rétention, l’engagement, la progression et la monétisation.', 'Mon périmètre backend inclut OAuth Roblox, l’ingestion analytics et la synchronisation des métriques. L’intégration GitHub App associe les expériences aux dépôts et vérifie les permissions et la configuration du projet.'] },
        { heading: 'Orchestrer des agents avec des états persistés', paragraphs: ['Un worker asynchrone utilisant pg-boss et PostgreSQL orchestre les étapes de préparation, analyse, modification, validation, revue et publication. Les états persistés, la prévention des doublons et la gestion des reprises encadrent l’exécution.', 'L’enjeu est de construire un workflow inspectable : connaître l’étape en cours, les outils autorisés et les actions effectuées. Un agent qui modifie un dépôt doit pouvoir être contrôlé au-delà de la seule qualité de sa réponse.'] },
        { heading: 'Une autonomie configurable, jusqu’au fonctionnement autonome', paragraphs: ['Selon les réglages choisis par l’utilisateur, le workflow peut automatiser l’analyse, les modifications, les tests, les pull requests et les rollbacks. Les validations humaines, les permissions et le niveau d’autonomie dépendent de cette configuration.'], bullets: ['Opérations sur les fichiers dans des conteneurs Docker temporaires et limités.', 'Séparation des secrets et périmètre de modification contrôlé.', 'Validations StyLua, Selene et Rojo selon la configuration.', 'Chiffrement des jetons, journal d’audit et contrôle des budgets IA.'] },
        { heading: 'Ce que je peux apporter à une mission agents IA', paragraphs: ['Cette réalisation relie intégrations métier, API, files de tâches et actions d’agents. Je souhaite contribuer à des systèmes où l’IA peut utiliser des outils et exécuter un processus avec des limites explicites et des mécanismes de reprise.', 'LevelPilot reste un projet en développement. Les valeurs de rétention et les exemples de PR affichés dans les animations du portfolio sont illustratifs. Ils ne démontrent pas un gain obtenu sur un jeu en production.'] },
      ],
      links: [{ label: 'Voir l’organisation GitHub LevelPilot', href: 'https://github.com/LevelPilot' }],
    },
    {
      slug: 'mission-genai', label: 'Mission backend & GenAI',
      title: 'Mission backend & GenAI | Clément Ozor',
      description: 'Clément Ozor recherche une mission backend et/ou GenAI début 2027, via portage salarial : présentiel en Île-de-France, hybride ou télétravail intégral.',
      heading: 'Une mission backend et GenAI Engineering au service de votre produit',
      intro: 'Software Engineer backend chez Thales, je recherche une mission longue en développement backend et/ou en IA générative, via portage salarial, à partir de début 2027. Je m’adapte à l’organisation de l’équipe : sur site en Île-de-France, en hybride ou entièrement à distance.',
      status: 'Disponible début 2027. La date précise et le périmètre sont à discuter.',
      tagline: ['Disponible', 'début 2027'],
      highlight: 'GenAI Engineering',
      facts: [
        { label: 'Rôle', value: 'Backend / GenAI Engineer' },
        { label: 'Lieu', value: 'Île-de-France / à distance' },
        { label: 'Format', value: 'Mission longue (6 mois minimum)' },
        { label: 'Contrat', value: 'Portage salarial' },
        { label: 'Début', value: 'Début 2027' },
      ],
      stack: ['Go', 'Python', 'TypeScript', 'RAG', 'LLM', 'LangChain', 'LangGraph', 'Agents IA'],
      sections: [
        { heading: 'Un socle software engineering pour les applications GenAI', paragraphs: ['Chez Thales, je développe des services backend en Go sur la Combat Digital Platform. Mon parcours comprend les systèmes distribués, l’interopérabilité entre protocoles, l’intégration robotique et le développement full-stack.', 'Mes réalisations en IA générative sont des projets personnels. Elles complètent mon expérience backend sans être présentées comme des missions GenAI réalisées chez Thales.'] },
        { heading: 'Les contributions que je souhaite prendre en charge', paragraphs: ['Je souhaite rejoindre une équipe pour contribuer au développement de son produit et y apporter mes compétences backend et en IA générative. Je peux notamment intégrer des LLM, des pipelines RAG ou des agents IA lorsque ces approches répondent à un besoin concret.'], bullets: ['Développement d’API et intégration de modèles de langage.', 'Pipelines RAG, recherche hybride et réponses sourcées.', 'Orchestration d’agents autonomes, tâches asynchrones et états persistés.', 'Permissions, validation des actions, budgets et traçabilité.'] },
        { heading: 'Des projets à examiner ensemble', paragraphs: ['Personal RAG illustre mon travail sur l’indexation et les réponses contextualisées avec citations. LevelPilot illustre les intégrations backend et les workflows d’agents avec autonomie configurable.', 'Je peux présenter les choix d’architecture, les limites connues et mon périmètre de contribution. LangChain et LangGraph figurent dans mes compétences ; la stack documentée de LevelPilot repose sur TypeScript, pg-boss, PostgreSQL et l’API OpenAI.'] },
        { heading: 'Modalités et premier échange', paragraphs: [engagementSummary.fr, 'Pour un premier échange, décrivez le produit, les besoins et les éventuels usages IA envisagés, la stack, la composition de l’équipe et les contraintes de présence. Nous pourrons discuter du périmètre et des projets les plus pertinents pour votre besoin.'] },
      ],
      links: [{ label: 'Consulter mon profil LinkedIn', href: 'https://www.linkedin.com/in/clement-ozor' }],
    },
  ],
  en: [
    {
      slug: 'personal-rag', label: 'Document RAG assistants',
      title: 'Python RAG development: Personal RAG | Clément Ozor',
      description: 'Explore Personal RAG, a Python document assistant with hybrid search, reranking and cited answers. Architecture and implementation by Clément Ozor.',
      heading: 'Personal RAG: a document assistant that cites its sources',
      intro: 'I develop Personal RAG to query project documentation through a chat or an API. The system retrieves relevant passages before generating a contextual answer, with citations that let readers locate the original sources.',
      status: 'Personal project in development, integrated into this portfolio and MMA Scan.',
      tagline: ['Every answer', 'cites its sources'],
      stack: ['Python', 'FastAPI', 'LangChain', 'ChromaDB', 'OpenAI'],
      sections: [
        { heading: 'A reusable assistant for project documentation', paragraphs: ['The starting point is to understand my projects and request advice grounded in their documentation. Personal RAG separates the document corpus, retrieval and generation so another corpus can be indexed.', 'Integration into this portfolio and MMA Scan is confirmed. Extending it to my other projects remains a goal. Personal RAG’s stack should not be confused with this portfolio’s backend, which has its own implementation.'] },
        { heading: 'From indexing to answers with citations', paragraphs: ['Incremental indexing uses SHA-256 fingerprints to identify changes. Documents are synchronized with persistent vector storage to retrieve useful passages for each question.'], bullets: ['Semantic search with a relevance threshold.', 'Hybrid search combining retrieval signals.', 'Reranking and agent orchestration to improve relevance.', 'Contextual generation with citations and source traceability.'] },
        { heading: 'What this project demonstrates', paragraphs: ['This project covers a complete RAG pipeline: preparing the corpus, indexing, retrieving context and presenting answers through an interface or API. Citations make the retrieved passages inspectable rather than asking readers to trust generated text alone.', 'Enterprise integration also requires defining access rights, document confidentiality, freshness and behavior when sources cannot answer a question. These requirements need to be scoped for each engagement.'] },
        { heading: 'Evaluate quality before expanding', paragraphs: ['I propose starting with representative questions and expected passages to evaluate retrieval and answers. Relevance, faithfulness to sources, latency and cost should be measured together.', 'No numerical benchmark is published here. The repository provides material for reviewing the project; the portfolio’s visual examples illustrate behavior and are not production results.'] },
      ],
      links: [{ label: 'Review the project-brain repository', href: 'https://github.com/TheSn0wDev/project-brain' }],
    },
    {
      slug: 'agents-ia-autonomes', label: 'Autonomous AI agents',
      title: 'Autonomous AI agents: LevelPilot backend | Clément Ozor',
      description: 'Explore autonomous AI agent orchestration in LevelPilot: asynchronous workflows, permissions, checks and configurable pull requests and rollbacks.',
      heading: 'Autonomous AI agents: from analysis to verifiable actions',
      intro: 'I develop LevelPilot’s backend with a colleague who handles the frontend. This SaaS platform aims to help Roblox creators improve their games using player data and AI agents with configurable autonomy.',
      status: 'LevelPilot is in development. No measured improvement or production launch is announced.',
      tagline: ['Autonomy', 'under control'],
      stack: ['TypeScript', 'Node.js', 'PostgreSQL', 'Prisma', 'pg-boss', 'Docker', 'OpenAI', 'Luau'],
      sections: [
        { heading: 'A data-driven improvement loop', paragraphs: ['The intended loop measures player behavior, analyzes indicators, identifies an opportunity, prepares a change, tests it and then measures its impact. Goals include retention, engagement, progression and monetization.', 'My backend scope includes Roblox OAuth, analytics ingestion and metric synchronization. The GitHub App integration connects experiences to repositories and checks permissions and project configuration.'] },
        { heading: 'Orchestrating agents with persistent state', paragraphs: ['An asynchronous worker using pg-boss and PostgreSQL orchestrates preparation, analysis, modification, validation, review and publication. Persistent state, duplicate prevention and recovery handling frame execution.', 'The goal is an inspectable workflow: knowing its current stage, allowed tools and completed actions. An agent that modifies a repository needs controls beyond the quality of its generated answer.'] },
        { heading: 'Configurable autonomy, including autonomous operation', paragraphs: ['Depending on the user’s settings, the workflow can automate analysis, changes, tests, pull requests and rollbacks. Human approvals, permissions and autonomy depend on this configuration.'], bullets: ['File operations in temporary, resource-limited Docker containers.', 'Secret isolation and controlled modification scope.', 'StyLua, Selene and Rojo validation according to configuration.', 'Token encryption, audit logs and AI budget controls.'] },
        { heading: 'What I can contribute to an AI agent engagement', paragraphs: ['This project connects business integrations, APIs, task queues and agent actions. I want to contribute to systems where AI can use tools and execute processes with explicit limits and recovery mechanisms.', 'LevelPilot remains in development. Retention values and pull request examples in the portfolio animations are illustrative. They do not demonstrate improvements measured on a production game.'] },
      ],
      links: [{ label: 'View the LevelPilot GitHub organization', href: 'https://github.com/LevelPilot' }],
    },
    {
      slug: 'mission-genai', label: 'Backend & GenAI engagement',
      title: 'Backend & GenAI Engineer for hire | Clément Ozor',
      description: 'Clément Ozor seeks a backend and/or GenAI engagement from early 2027 through a French umbrella company: on-site in Île-de-France, hybrid or fully remote.',
      heading: 'A backend and GenAI engineering engagement to help build your product',
      intro: 'As a backend Software Engineer at Thales, I seek a long-term backend and/or generative AI engagement through a French umbrella company (portage salarial), from early 2027. I adapt to the team’s working arrangements: on-site in Île-de-France, hybrid or fully remote.',
      status: 'Available from early 2027. Exact start date and scope to be discussed.',
      tagline: ['Available', 'early 2027'],
      highlight: 'GenAI engineering',
      facts: [
        { label: 'Role', value: 'Backend / GenAI Engineer' },
        { label: 'Location', value: 'Île-de-France / remote' },
        { label: 'Format', value: 'Long-term (6 months minimum)' },
        { label: 'Contract', value: 'Salary portage' },
        { label: 'Start', value: 'Early 2027' },
      ],
      stack: ['Go', 'Python', 'TypeScript', 'RAG', 'LLM', 'LangChain', 'LangGraph', 'AI agents'],
      sections: [
        { heading: 'Software engineering foundations for GenAI applications', paragraphs: ['At Thales, I develop Go backend services on the Combat Digital Platform. My background includes distributed systems, protocol interoperability, robotics integration and full-stack development.', 'My generative AI work consists of personal projects. These complement my backend experience and are not presented as GenAI client engagements delivered at Thales.'] },
        { heading: 'Contributions I want to take on', paragraphs: ['I want to join a team to help develop its product and contribute my backend and generative AI skills. I can integrate LLMs, RAG pipelines or AI agents where these approaches address a concrete need.'], bullets: ['API development and language model integration.', 'RAG pipelines, hybrid retrieval and answers with citations.', 'Autonomous agent orchestration, asynchronous tasks and persistent state.', 'Permissions, action validation, budgets and traceability.'] },
        { heading: 'Projects we can review together', paragraphs: ['Personal RAG illustrates indexing and contextual answers with citations. LevelPilot illustrates backend integrations and agent workflows with configurable autonomy.', 'I can walk through architecture decisions, known limitations and my contribution. LangChain and LangGraph are among my skills; LevelPilot’s documented stack uses TypeScript, pg-boss, PostgreSQL and the OpenAI API.'] },
        { heading: 'Working arrangement and first conversation', paragraphs: [engagementSummary.en, 'For a first conversation, describe the product, needs and any potential AI use cases, stack, team and on-site requirements. We can discuss the scope and the projects most relevant to your needs.'] },
      ],
      links: [{ label: 'View my LinkedIn profile', href: 'https://www.linkedin.com/in/clement-ozor' }],
    },
  ],
}

export function getSeoPage(locale: Locale, slug: string) {
  return seoPages[locale].find(page => page.slug === slug)
}
