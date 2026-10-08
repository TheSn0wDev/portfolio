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
  // Controller → radio → vehicle : one latency reading (ms) per order sent.
  | { kind: 'rcLink'; latencies: [number, number, number, number] }
  // Editor typing code → live map render → diagnostic badge.
  | { kind: 'codeSandbox'; file: string; code: string[]; diagnostic: { status: 'ok' | 'error'; label: string } }
  // Mosaic of video/sensor feeds stacking up, then a replay timeline whose
  // playhead scrubs in a loop ; markers are event positions on the timeline (0–1).
  | {
      kind: 'cohoma'
      feeds: { label: string; kind: 'uav' | 'ugv' | 'cam' }[]
      markers: number[]
    }
  // Forest fire mission : the R4 drives in and opens its roof box, the drones
  // (up to three) take off, map the fire front (zone) and stream a thermal
  // feed (shown for the second drone) back to the car, then land again.
  | { kind: 'rescue'; drones: string[]; feed: string; zone: string }
  // Puzzle : plugins drift in and snap into the sockets of a central core,
  // which boots once all are in. Up to four plugins (left, top, right, bottom).
  // Tactical map : allied APP-6 units linked by a data mesh. The first unit
  // spots the enemy, the track spreads hop by hop over the mesh, then every
  // unit converges on it and neutralises it. Four units : recon first.
  | {
      kind: 'tacticalMesh'
      units: { label: string; type: 'recon' | 'infantry' | 'armour' | 'mechanized' }[]
      enemy: string
    }
  | { kind: 'luma'; core: string; plugins: string[] }
  // Live DJ set : an equalizer bounces over a sound wave while a song request
  // bubble pops in, a tip coin drops onto it and the DJ queues the track.
  | { kind: 'djise'; song: string; artist: string; tip: string }
  // GTA-style minimap of the Île d'Oléron : a waypoint is set and the player
  // drives over the viaduct to it, blips and street names along the way, next
  // to a HUD with the server name, the lead and the team (up to six).
  | { kind: 'rpMinimap'; server: string; place: string; lead: string; team: number }
  // Closed improvement loop : a KPI curve dips, the AI agent (an avatar with
  // a status line) diagnoses it (insight), moves over to the code, types the
  // fix in a PR, runs its checks, clicks Merge and the curve climbs back, the
  // KPI moving from `before` to `after`.
  | {
      kind: 'levelPilot'
      kpi: string
      before: string
      after: string
      delta: string
      insight: string
      fix: string
      pr: { id: number; file: string; diff: [string, string] }
      checks: string[]
    }
  | { kind: 'placeholder'; label: string }

export type ProjectStatus = 'live' | 'dev' | 'production' | 'done' | 'archived' | 'abandoned'

// kind picks the icon and visible text ; label is the accessible name.
export type ProjectLink = { kind: 'repo' | 'site' | 'article'; href: string; label?: string }

export type Project = {
  status: ProjectStatus
  context: string
  title: string
  links?: ProjectLink[]
  visual: ProjectVisual
  bullets?: string[]
  description?: string
  stack: string[]
}

export const projects: Project[] = [
  {
    "status": "dev",
    "context": "Projet personnel",
    "title": "Personal RAG",
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
    "description": "Un assistant qui répond aux questions posées sur un ensemble de documents personnels (PDF, Word, texte) en citant ses sources, en chat ou via une API.",
    "bullets": [
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
    "links": [
      { "kind": "repo", "href": "https://github.com/TheSn0wDev/project-brain", "label": "Voir le dépôt project-brain" }
    ]
  },
  {
    status: 'dev',
    context: 'SaaS',
    title: 'LevelPilot',
    links: [{ kind: 'repo', href: 'https://github.com/LevelPilot', label: 'Voir l’organisation GitHub LevelPilot' }],
    visual: {
      kind: 'levelPilot',
      kpi: 'Rétention J1',
      before: '31 %',
      after: '38 %',
      delta: '+7 pts',
      insight: 'Onboarding trop long',
      fix: 'Raccourcir l’onboarding',
      pr: { id: 42, file: 'Tutorial.luau', diff: ['- STEPS = 12', '+ STEPS = 5'] },
      checks: ['StyLua', 'Selene', 'Rojo'],
    },
    description: 'Une plateforme SaaS pour aider les créateurs de jeux Roblox à améliorer la rétention, l’engagement et la monétisation grâce aux données joueurs et à des agents IA. Je développe le backend avec un collègue chargé du frontend.',
    bullets: [
      'Intégrations Roblox et GitHub, collecte analytics et suivi des KPIs.',
      'Agents configurables jusqu’à 100 % d’autonomie : analyse, modifications, tests, PR et rollback automatiques.',
      'Permissions, chiffrement des jetons, audit et contrôle des budgets IA.',
    ],
    stack: ['TypeScript', 'Next.js', 'Prisma', 'PostgreSQL', 'Docker', 'OpenAI', 'Luau'],
  },
  {
    "status": "live",
    "context": "SaaS",
    "title": "MMA Scan",
    "visual": {
      "kind": "faceOff",
      "fighters": [
        "B. Saint-Denis",
        "F. Ziam"
      ],
      "stats": [
        { "label": "Frappes / min", "values": [5.6, 4.4] },
        { "label": "Précision", "values": [51, 48], "unit": "%" },
        { "label": "Takedowns", "values": [3.4, 0.9] }
      ],
      "pick": 0,
      "confidence": 68
    },
    "description": "Un SaaS qui compare deux combattants de MMA, rédige une analyse argumentée du combat, puis confronte ses pronostics aux résultats officiels.",
    "bullets": [
      "Conception et développement full-stack, de la base PostgreSQL à l’interface Next.js.",
      "Croisement des statistiques, des styles et de la forme récente pour générer des analyses et des scénarios de combat.",
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
    "links": [
      { "kind": "site", "href": "https://mmascan.fr/", "label": "Découvrir MMA Scan" }
    ]
  },
  {
    "status": "production",
    "context": "Thales",
    "title": "Combat Digital Platform",
    "visual": {
      "kind": "tacticalMesh",
      "units": [
        { "label": "RECO", "type": "recon" },
        { "label": "INF", "type": "infantry" },
        { "label": "CHAR", "type": "armour" },
        { "label": "MÉCA", "type": "mechanized" }
      ],
      "enemy": "ENI"
    },
    "description": "Plateforme de commandement numérique de Thales connectant véhicules, capteurs et unités pour le combat collaboratif.",
    "bullets": [
      "Développement et maintenance de services backend en Go au sein de la Combat Digital Platform.",
      "Conception et implémentation d’une passerelle d’interopérabilité entre les protocoles OTAN JDSS et MIM.",
      "Développement de composants d’intégration pour des systèmes distribués à fortes contraintes d’interopérabilité."
    ],
    "stack": ["Go", "Java", "Python", "Docker", "GitLab CI", "PostgreSQL"],
    "links": [
      { "kind": "site", "href": "https://www.thalesgroup.com/fr/catalogue-de-solutions/defense/terrestre/combat-digital-platform", "label": "Découvrir la Combat Digital Platform sur le site de Thales" }
    ]
  },
  {
    "status": "done",
    "context": "Thales",
    "title": "CoHoMa III",
    "visual": {
      "kind": "cohoma",
      "feeds": [
        { "label": "UAV 1", "kind": "uav" },
        { "label": "UAV 2", "kind": "uav" },
        { "label": "UGV 1", "kind": "ugv" },
        { "label": "Thermique", "kind": "cam" }
      ],
      "markers": [0.22, 0.47, 0.8]
    },
    "description": "Challenge de l’Agence de l’innovation de défense sur la collaboration homme-machine, où drones et robots terrestres opèrent aux côtés d’opérateurs humains.",
    "bullets": [
      "Développement full-stack et intégration logicielle de systèmes robotiques.",
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
    "links": [
      { "kind": "article", "href": "https://www.defense.gouv.fr/aid/actualites/cohoma-iii-ledition-consolidation", "label": "Lire la présentation du challenge" }
    ]
  },
  {
    "status": "done",
    "context": "Thales",
    "title": "Code Sandbox",
    "visual": {
      "kind": "codeSandbox",
      "file": "map.ts",
      "code": [
        "const map = new MapView(canvas)",
        "map.add(unit('SFGPUCI', 'II'))",
        "map.add(unit('SHGPUCA', 'I'))",
        "map.add(task('ATTACK', axis))"
      ],
      "diagnostic": { "status": "ok", "label": "0 erreur · 14 ms" }
    },
    "description": "Un outil interne basé sur VS Code où les développeurs écrivent du code cartographique et voient la carte se mettre à jour en direct.",
    "bullets": [
      "Intégration d’un SDK cartographique et d’une vue web avec rendu en direct.",
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
    "status": "dev",
    "context": "Open source",
    "title": "Fulgur",
    "visual": {
      "kind": "rcLink",
      "latencies": [18, 23, 16, 21]
    },
    "description": "Un véhicule radiocommandé tout-terrain piloté à la manette avec retour caméra FPV, pensé comme une plateforme modulaire d’expérimentation robotique ; développé sur mon temps personnel.",
    "bullets": [
      "Architecture présentée autour du contrôle en C++, des communications et des pilotes matériels.",
      "Communications sur WebSocket, UDP et liaison série ; lecture de la manette avec SDL3."
    ],
    "stack": [
      "C++",
      "SDL3",
      "WebSocket",
      "UDP",
      "Série"
    ],
    "links": [
      { "kind": "repo", "href": "https://github.com/TheSn0wDev/fulgur", "label": "Voir le dépôt Fulgur" }
    ]
  },
  {
    "status": "done",
    "context": "Thales",
    "title": "Vision4Rescue",
    "visual": {
      "kind": "rescue",
      "drones": ["UAV 1", "UAV 2", "UAV 3"],
      "feed": "Thermique",
      "zone": "Front de feu"
    },
    "description": "Démonstrateur dédié aux services de secours, associant un centre de commandement mobile, des drones et des équipements connectés.",
    "bullets": [
      "Contribution au démonstrateur Vision4Rescue pendant ma participation à CoHoMa III chez Thales.",
      "Le démonstrateur s’appuie sur la Combat Digital Platform de Thales, plateforme sur laquelle je travaille actuellement."
    ],
    "stack": [
      "CDP",
      "Robotique"
    ],
    "links": [
      { "kind": "site", "href": "https://www.renault.fr/gamme-concept-cars/vision-4rescue.html", "label": "Découvrir le démonstrateur Vision4Rescue" }
    ]
  },
  {
    "status": "dev",
    "context": "Open source",
    "title": "Luma Framework",
    "visual": {
      "kind": "luma",
      "core": "Luma",
      "plugins": ["Inventaire", "Économie", "Véhicules", "Métiers"]
    },
    "description": "Un framework modulaire en TypeScript pour créer des serveurs de jeu de rôle, avec GTA VI pour cible ; développé sur mon temps personnel.",
    "bullets": [
      "Cœur minimal étendu par des modules et des plugins.",
      "SDK, marketplace et outils de test figurent parmi les évolutions annoncées."
    ],
    "stack": [
      "TypeScript",
      "Architecture modulaire",
      "Gaming"
    ]
  },
  {
    "status": "archived",
    "context": "Projet personnel",
    "title": "Djise",
    "visual": {
      "kind": "djise",
      "song": "One More Time",
      "artist": "Daft Punk",
      "tip": "2 €"
    },
    "description": "Une application qui permet au public d’envoyer des demandes musicales au DJ pendant sa prestation, accompagnées d’un pourboire.",
    "bullets": [
      "Développement réalisé seul, du frontend Next.js au backend NestJS.",
      "Intégration de Stripe pour les paiements des pourboires.",
      "Projet archivé faute de budget et de marketing."
    ],
    "stack": [
      "TypeScript",
      "Next.js"
    ]
  },
  {
    "status": "abandoned",
    "context": "Extra-professionnel",
    "title": "Atlantique RP",
    "visual": {
      "kind": "rpMinimap",
      "server": "Atlantique RP",
      "place": "Île d’Oléron",
      "lead": "Lead Dev",
      "team": 5
    },
    "description": "Serveur FiveM de GTA V RP dans un univers français situé sur l’île d’Oléron.",
    "bullets": [
      "Lead Developer de janvier 2022 à septembre 2023.",
      "Recrutement de développeurs, rédaction de cahiers des charges techniques et management d’une équipe de cinq personnes."
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
