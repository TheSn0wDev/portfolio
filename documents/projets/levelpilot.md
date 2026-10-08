# Clément Ozor - Projet LevelPilot

## Présentation et équipe

LevelPilot est une plateforme SaaS en cours de développement qui aide les studios et développeurs Roblox à améliorer un jeu existant à partir des données joueurs et d'agents IA. Le produit vise à améliorer la rétention, l'engagement, la progression et la monétisation.

Clément Ozor développe ce projet avec un collègue. Clément est chargé du développement backend ; son collègue s'occupe du frontend.

## Objectif du produit

La boucle visée est : mesurer les comportements joueurs, analyser les indicateurs, identifier une opportunité, proposer une amélioration, préparer une modification et une pull request, puis tester et mesurer son impact.

Les agents doivent travailler à partir de données structurées et d'objectifs mesurables, avec des permissions explicites, des contrôles et une traçabilité des opérations.

## Contribution backend de Clément

- Intégration OAuth Roblox, gestion de plusieurs expériences et synchronisation des métriques Roblox : rétention J1/J7, joueurs actifs quotidiens, durée moyenne de session, conversion payeur et revenus. Persistance des résultats et historique pour comparer les périodes.
- API de collecte analytics, gestion des clés d'ingestion et authentification du SDK par jetons temporaires. Développement du SDK Luau côté serveur, avec renouvellement de session, file d'événements et diagnostics de transport.
- Intégration GitHub App : association des expériences aux dépôts et branches, vérification des permissions et du dossier de projet, chiffrement des jetons, renouvellement sérialisé et audit de la configuration.
- Orchestration d'agents IA par un worker asynchrone utilisant pg-boss et PostgreSQL : préparation, analyse, modification, validation, revue et publication. États persistés, prévention des doublons et gestion des reprises.
- Exécution des opérations sur les fichiers dans des conteneurs Docker temporaires et limités, avec séparation des secrets, périmètre de modification contrôlé et validations StyLua, Selene et Rojo selon la configuration.
- Automatisation des pull requests et des rollbacks selon la configuration choisie par l'utilisateur, journal d'audit, contrôle des budgets d'appels IA et tests des règles et du workflow.

## Stack observée

TypeScript, Node.js, Next.js côté serveur, Prisma, PostgreSQL, pg-boss, Docker, API OpenAI, OAuth Roblox, GitHub App, Luau et Rojo.

## Autonomie configurable

Clément précise que l'agent peut fonctionner de manière 100 % autonome selon la configuration choisie par l'utilisateur. Ce mode permet d'automatiser l'analyse, les modifications, les tests, la création des pull requests et les rollbacks. Le niveau d'autonomie, les permissions et les validations humaines dépendent des réglages de l'utilisateur.

Cette autonomie s'inscrit dans la boucle d'amélioration du jeu : identifier une opportunité, préparer et vérifier une modification, mesurer son impact et revenir en arrière si nécessaire. Les actions restent traçables dans le journal d'audit.

## État du développement

LevelPilot est en cours de développement à deux. Les intégrations Roblox et GitHub, l'ingestion analytics, la synchronisation des métriques et l'orchestration d'agents sont présentes dans le code examiné. L'autonomie configurable et les automatismes décrits ci-dessus sont précisés par Clément.

Aucun résultat chiffré d'amélioration d'un jeu, date de lancement ou fonctionnement en production n'est confirmé.
