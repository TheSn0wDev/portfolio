export type Experience = {
  title: string
  company: string
  location?: string
  period: string
  bullets: string[]
  impact?: string
  stack: string[]
}

export const experiences: Experience[] = [
  {
    title: 'Backend Software Engineer',
    company: 'Thales',
    location: 'Gennevilliers',
    period: 'Octobre 2025 → Aujourd’hui',
    bullets: [
      'Conception et implémentation d’une passerelle d’interopérabilité entre les protocoles OTAN JDSS et MIM.',
      'Développement et maintenance de services backend en Go au sein de la Combat Digital Platform.',
      'Développement de composants d’intégration pour des systèmes distribués à fortes contraintes d’interopérabilité.',
      'Participation à la conception technique, aux revues de code, tests et processus d’intégration continue.',
    ],
    stack: ['Go', 'Java', 'Python', 'Docker', 'GitLab CI', 'PostgreSQL'],
  },
  {
    title: 'Robotics Software Engineer',
    company: 'Thales',
    location: 'Gennevilliers',
    period: 'Mars 2025 → Septembre 2025',
    bullets: [
      'Développement full-stack et intégration logicielle de systèmes robotiques dans le cadre du Challenge CoHoMa III.',
      'Conception d’une chaîne complète de streaming vidéo temps réel et replay.',
      'Agrégation et visualisation de flux vidéo et de données multi-capteurs.',
      'Intégration de composants logiciels et matériels sur plateformes robotiques.',
    ],
    stack: ['C++', 'C', 'Python', 'Docker', 'Hardware'],
  },
  {
    title: 'Software Engineer',
    company: 'Thales',
    location: 'Vélizy',
    period: 'Avril 2023 → Juillet 2023',
    bullets: [
      'Développement d’un outil interne basé sur VS Code, intégrant un SDK cartographique et une vue web avec rendu en direct.',
      'Reproduction et diagnostic des bugs pour distinguer les défauts du SDK de ceux liés à son intégration dans différents projets.',
      'Mise en place de tests de performance et benchmarks du SDK.',
    ],
    stack: ['TypeScript', 'React', 'Vitest'],
  },
  {
  "title": "Lead Developer · Projet extra-professionnel",
  "company": "Atlantique RP",
  "period": "Janvier 2022 → Septembre 2023",
  "bullets": [
    "Recrutement de développeurs et management d’une équipe de cinq personnes.",
    "Rédaction de cahiers des charges techniques pour un serveur FiveM de GTA V RP, dans un univers français situé sur l’île d’Oléron."
  ],
  "stack": [
    "FiveM",
    "Lua",
    "React"
  ]
},
  {
  "title": "IT Technician",
  "company": "AZEOO",
  "period": "Juillet 2021 → Décembre 2021",
  "bullets": [
    "Refonte du site vitrine avec WordPress.",
    "Configuration des plugins de formulaires et de gestion des cookies.",
    "Travail en équipe avec Bitbucket pour la gestion des versions."
  ],
  "stack": [
    "WordPress",
    "Bitbucket"
  ]
},
  {
  "title": "Développeur frontend",
  "company": "Skytale",
  "period": "Après Ekalia · Dates à préciser",
  "bullets": [
    "Création et gestion de pages web à partir de maquettes UI/UX, au sein d’un studio associatif de jeux vidéo."
  ],
  "stack": [
    "HTML",
    "CSS",
    "JavaScript"
  ]
},
  {
  "title": "Développeur frontend bénévole",
  "company": "Ekalia",
  "period": "Vers 2018–2019 · À 16 ans",
  "bullets": [
    "Intégration de maquettes réalisées par une designer UI/UX en pages web.",
    "Création et gestion des pages pour une association organisant des événements gaming."
  ],
  "stack": [
    "HTML",
    "CSS",
    "JavaScript"
  ]
},
]

export const experienceAside = {
  eyebrow: 'Depuis',
  year: '2018' ,
  heading: 'Des systèmes logiciels exigeants, du prototype à la production.',
  description:
    'Des premiers projets web bénévoles à la coordination d’équipe, puis à la robotique et au backend de plateformes distribuées.',
}
