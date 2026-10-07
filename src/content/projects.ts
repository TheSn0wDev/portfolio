export type ProjectVisual =
  | { kind: 'flow'; steps: string[] }
  | { kind: 'ragCloud'; question: string; docs: string[]; answer: string; source: string }
  | { kind: 'chatPreview'; question: string; searchLabel: string; statusLabel: string }
  | {
      kind: 'faceOff'
      fighters: [string, string]
      stats: { label: string; values: [number, number]; unit?: string }[]
      // Index of the fighter the AI picks, and its win probability in %.
      pick: 0 | 1
      confidence: number
    }
  | { kind: 'placeholder'; label: string }

export type Project = {
  index: string
  category: string
  title: string
  url?: string
  linkLabel?: string
  visual: ProjectVisual
  bullets?: string[]
  description?: string
  stack: string[]
}

export const projects: Project[] = [
  {
    "index": "01",
    "title": "Personal RAG",
    "category": "Projet personnel · GenAI",
    "visual": {
      "kind": "ragCloud",
      "question": "Quand se termine mon contrat d’assurance ?",
      "docs": [
        "PDF",
        "DOCX",
        "TXT"
      ],
      "answer": "Le 31 mars 2027, renouvelable par tacite reconduction.",
      "source": "contrat-habitation.pdf, p. 2"
    },
    "bullets": [
      "Assistant documentaire réutilisable avec interface de chat et API.",
      "Indexation incrémentale par empreintes SHA-256 et stockage vectoriel persistant.",
      "Recherche sémantique et hybride, reranking et orchestration d’agents.",
      "Génération contextualisée avec citations et traçabilité des sources."
    ],
    "stack": [
      "Python",
      "FastAPI",
      "LangChain",
      "ChromaDB",
      "OpenAI"
    ],
    "url": "https://github.com/TheSn0wDev/project-brain",
    "linkLabel": "Voir le dépôt project-brain"
  },
  {
    "index": "02",
    "title": "MMA Scan",
    "category": "SaaS · Actif, en développement",
    "visual": {
      "kind": "faceOff",
      "fighters": [
        "Combattant A",
        "Combattant B"
      ],
      "stats": [
        { "label": "Frappes / min", "values": [5.1, 4.2] },
        { "label": "Précision", "values": [52, 46], "unit": "%" },
        { "label": "Takedowns", "values": [1.4, 2.3] }
      ],
      "pick": 0,
      "confidence": 68
    },
    "bullets": [
      "Conception et développement full-stack d’un SaaS de comparaison de combattants et d’analyse de combats MMA.",
      "Croisement des statistiques, des styles et de la forme récente pour générer des analyses argumentées et des scénarios de combat.",
      "Suivi des combattants, historique des analyses et évaluation des pronostics face aux résultats officiels.",
      "Déploiement automatisé avec GitHub Actions."
    ],
    "stack": [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Python",
      "LLM",
      "GitHub Actions"
    ],
    "url": "https://mmascan.fr/",
    "linkLabel": "Découvrir MMA Scan"
  },
  {
    "index": "03",
    "title": "Fulgur",
    "category": "Open source · En développement",
    "visual": {
      "kind": "flow",
      "steps": [
        "Commande",
        "Communications",
        "Contrôle",
        "Véhicule RC"
      ]
    },
    "bullets": [
      "Projet de véhicule radiocommandé tout-terrain, conçu comme une plateforme modulaire d’expérimentation robotique.",
      "Architecture présentée autour du contrôle en C++, des communications et des pilotes matériels.",
      "Pilotage par manette et caméra FPV dans le périmètre annoncé ; développement sur mon temps personnel."
    ],
    "stack": [
      "C++",
      "SDL3",
      "WebSocket",
      "UDP",
      "Série"
    ],
    "url": "https://github.com/TheSn0wDev/fulgur",
    "linkLabel": "Voir le dépôt Fulgur"
  },
  {
    "index": "04",
    "title": "Code Sandbox",
    "category": "Thales · Outillage développeur",
    "visual": {
      "kind": "flow",
      "steps": [
        "Code",
        "SDK cartographique",
        "Rendu direct",
        "Diagnostic"
      ]
    },
    "bullets": [
      "Développement d’un outil interne basé sur VS Code, intégrant un SDK cartographique et une vue web avec rendu en direct.",
      "Reproduction des bugs pour distinguer les défauts du SDK de ceux liés à son intégration dans différents projets.",
      "Mise en place de tests de performance et de benchmarks."
    ],
    "stack": [
      "TypeScript",
      "React",
      "Vitest"
    ]
  },
  {
    "index": "05",
    "title": "CoHoMa III",
    "category": "Thales · Robotique · 2025",
    "visual": {
      "kind": "flow",
      "steps": [
        "Robots",
        "Vidéo & capteurs",
        "Visualisation",
        "Replay"
      ]
    },
    "bullets": [
      "Développement full-stack et intégration logicielle de systèmes robotiques pour le challenge de collaboration homme-machine.",
      "Conception d’une chaîne complète de streaming vidéo temps réel et de replay.",
      "Agrégation et visualisation de flux vidéo et de données multi-capteurs, intégration logicielle et matérielle."
    ],
    "stack": [
      "C++",
      "C",
      "Python",
      "Docker",
      "Robotique"
    ],
    "url": "https://www.defense.gouv.fr/aid/actualites/cohoma-iii-ledition-consolidation",
    "linkLabel": "Lire la présentation du challenge"
  },
  {
    "title": "Vision4Rescue",
    "category": "Thales · Services de secours · 2025",
    "visual": {
      "kind": "flow",
      "steps": [
        "Drones",
        "CDP",
        "Commandement",
        "Secours"
      ]
    },
    "bullets": [
      "Contribution au démonstrateur Vision4Rescue pendant ma participation à CoHoMa III chez Thales.",
      "Dispositif dédié aux services de secours, associant un centre de commandement mobile, des drones et des équipements connectés.",
      "Le démonstrateur s’appuie sur la Combat Digital Platform de Thales, plateforme sur laquelle je travaille actuellement."
    ],
    "stack": [
      "CDP",
      "Robotique"
    ],
    "url": "https://www.renault.fr/gamme-concept-cars/vision-4rescue.html",
    "linkLabel": "Découvrir le démonstrateur Vision4Rescue",
    "index": "06"
  },
  {
    "index": "07",
    "title": "Luma Framework",
    "category": "Open source · En développement",
    "visual": {
      "kind": "flow",
      "steps": [
        "TypeScript",
        "Modules",
        "Plugins",
        "Serveurs RP"
      ]
    },
    "bullets": [
      "Projet de framework modulaire en TypeScript pour la création de serveurs de jeu de rôle.",
      "GTA VI est la cible annoncée du projet ; développement sur mon temps personnel.",
      "SDK, marketplace et outils de test figurent parmi les évolutions annoncées."
    ],
    "stack": [
      "TypeScript",
      "Architecture modulaire",
      "Gaming"
    ]
  },
  {
    "index": "08",
    "title": "Djise",
    "category": "Projet personnel · Archivé",
    "visual": {
      "kind": "flow",
      "steps": [
        "Audience",
        "Demande musicale",
        "Pourboire",
        "DJ"
      ]
    },
    "bullets": [
      "Projet d’application connectant les DJs à leur audience pendant une prestation.",
      "Concept : envoyer des demandes musicales en direct, accompagnées de pourboires.",
      "Projet archivé faute de budget et de marketing."
    ],
    "stack": [
      "TypeScript",
      "Next.js"
    ]
  },
  {
    "index": "09",
    "title": "Atlantique RP",
    "category": "Projet extra-professionnel · Abandonné",
    "visual": {
      "kind": "flow",
      "steps": [
        "Cahier des charges",
        "Équipe",
        "Développement",
        "Serveur RP"
      ]
    },
    "bullets": [
      "Lead Developer de janvier 2022 à septembre 2023 sur un serveur FiveM de GTA V RP.",
      "Recrutement de développeurs, rédaction de cahiers des charges techniques et management d’une équipe de cinq personnes.",
      "Univers français situé sur l’île d’Oléron ; projet aujourd’hui abandonné."
    ],
    "stack": [
      "FiveM",
      "Lua",
      "React"
    ]
  }
]

export const githubCard = {
  eyebrow: 'Et plus encore',
  heading: 'Tous mes projets sur',
  highlighted: 'GitHub',
  handle: '@TheSn0wDev',
  url: 'https://github.com/TheSn0wDev',
}
