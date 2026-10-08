# Sources du corpus du portfolio

Corpus préparé le 7 octobre 2026 dans `documents/`.

## Sources utilisées

- CV PDF fourni par Clément Ozor : "Clément Ozor - Software Engineer | Backend & AI", une page. La date de rédaction du CV n'est pas précisée. Le texte et les liens ont été extraits du PDF, puis vérifiés sur un rendu de la page.
- Portfolio précédent : `src/App.tsx` dans le commit `77402f1052ca4241be5ad53c8bdcec908ee60724` de `main`, récupéré dans Git après le nettoyage de la v3.

Le corpus biographique initial utilise le CV, le portfolio précédent et les captures fournies. Les liens de projets y sont repris sans vérification. Le glossaire a ensuite été enrichi à partir des références publiques ci-dessous, consultées le 7 octobre 2026.

## Mise à jour fournie par Clément Ozor

Le 7 octobre 2026, Clément a précisé sa disponibilité : début 2027, date précise à discuter. Cette information complète le CV dans les documents de profil et de contact.

La capture fournie le 7 octobre 2026 complète la formation avec le concours général des lycées 2020 (innovation et développement durable), le baccalauréat STI2D 2020 avec mention bien, et le brevet d'initiation aéronautique 2018. Aucun prix ou classement au concours n'est indiqué.

Les deux captures d'expériences fournies le 7 octobre 2026 ajoutent le rôle de Lead Developer sur Atlantique RP (projet extra-professionnel, janvier 2022 à septembre 2023, recrutement, cahiers des charges techniques, management de cinq personnes) et le rôle d'IT Technician chez AZEOO (juillet à décembre 2021, refonte WordPress, configuration des plugins et travail en équipe avec Bitbucket). Ces informations enrichissent aussi les deux fiches projets.

Le 7 octobre 2026, Clément a décrit Djise comme un projet connectant les DJs à leur audience par des demandes musicales reçues en direct, accompagnées de pourboires. Clément a également précisé que Djise est désormais archivé, faute de budget et de marketing. La description ne déduit ni prestataire de paiement ni garantie de passage d'un morceau.

Le 7 octobre 2026, Clément a précisé avoir été développeur frontend bénévole chez Ekalia à 16 ans, être né en 2002, et avoir créé et géré des pages web à partir de maquettes réalisées par une designer UI/UX de l'équipe. La période approximative 2018-2019 est déduite de l'âge et de l'année de naissance ; elle ne constitue pas une durée d'engagement confirmée.

Le 7 octobre 2026, Clément a confirmé que MMA Scan est actif et toujours en cours de développement.

## Choix de synthèse

- Le CV fourni est prioritaire pour le positionnement, les expériences, les compétences, la formation et la recherche de mission.
- L'ancienne disponibilité les soirs et week-ends n'est pas présentée comme la disponibilité actuelle.
- Les 14 projets du portfolio précédent sont conservés. Les statuts issus du portfolio précédent sont présentés comme historiques, sauf ceux d'Atlantique RP (abandonné) et de Djise (archivé faute de budget et de marketing), confirmés par Clément.
- Personal RAG et MMA Scan sont ajoutés à partir du CV. Personal RAG n'est pas assimilé au chantier RAG du portfolio v3.
- CoHoMa III est enrichi avec l'expérience robotique décrite dans le CV. Le périmètre commun avec Vision4Rescue est confirmé par Clément le 8 octobre 2026.
- Les coordonnées du CV, dont le téléphone, sont incluses dans `documents/contact.md`.
- Les descriptions ne déduisent ni niveaux de maîtrise, ni dates de disponibilité, ni métriques ou responsabilités absentes des sources.
- Le corpus comporte 28 fichiers Markdown : cinq documents biographiques, dix-huit fiches projets et cinq fichiers de glossaire comprenant 69 entrées.

## Provenance par document

Les sections de sources sont centralisées ici pour ne pas être incluses dans les embeddings. Les liens utiles restent dans les fiches. Le champ `source` de chaque passage conserve le chemin du document pour les citations du RAG.

| Document | Origine |
|---|---|
| `documents/competences.md` | CV fourni ; Portfolio précédent (`main`) |
| `documents/contact.md` | CV fourni ; Portfolio précédent (`main`) ; Disponibilité précisée le 7 octobre 2026 |
| `documents/experiences.md` | CV fourni ; captures des expériences fournies le 7 octobre 2026 |
| `documents/formation.md` | CV fourni ; capture des formations fournie le 7 octobre 2026 |
| `documents/profil.md` | CV fourni ; Portfolio précédent (`main`) ; Disponibilité précisée le 7 octobre 2026 |
| `documents/projets/atlantique-rp.md` | Portfolio précédent (`main`) ; capture de l'expérience et précisions de Clément le 7 octobre 2026 |
| `documents/projets/azeoo.md` | Portfolio précédent (`main`) ; capture de l'expérience fournie le 7 octobre 2026 ; présentation et conditions officielles AZEOO consultées le 7 octobre 2026 |
| `documents/projets/code-sandbox.md` | CV fourni : expérience Software Engineer chez Thales à Vélizy, avril à juillet 2023 ; précisions de Clément le 7 octobre 2026 |
| `documents/projets/cohoma-iii.md` | CV fourni ; Portfolio précédent (`main`) ; présentations officielles AID et Battle Lab Terre consultées le 7 octobre 2026 |
| `documents/projets/djise.md` | Portfolio précédent (`main`) ; description du concept fournie par Clément le 7 octobre 2026 |
| `documents/projets/ekalia.md` | Portfolio précédent (`main`) ; site officiel Ekalia et précisions de Clément le 7 octobre 2026 |
| `documents/projets/facebook-marketplace-bot.md` | Portfolio précédent (`main`) ; README, code et statut du dépôt GitHub consultés le 7 octobre 2026 |
| `documents/projets/levelpilot.md` | Lecture du code, de la documentation et des commits attribués à TheSn0wDev dans les projets locaux LevelPilot ; rôle backend, travail en binôme et autonomie configurable jusqu’à 100 % précisés par Clément le 8 octobre 2026 |
| `documents/projets/fulgur.md` | Portfolio précédent (`main`) ; README et structure du dépôt GitHub consultés le 7 octobre 2026 ; statut confirmé par Clément le 7 octobre 2026 |
| `documents/projets/luma-framework.md` | Portfolio précédent (`main`) ; dépôt et présentation de l'organisation GitHub consultés le 7 octobre 2026 ; statut confirmé par Clément |
| `documents/projets/mma-scan.md` | CV fourni ; statut actif et en développement confirmé par Clément le 7 octobre 2026 |
| `documents/projets/my-rpg.md` | Portfolio précédent (`main`) ; README du dépôt GitHub consulté le 7 octobre 2026 |
| `documents/projets/next-citizens.md` | Portfolio précédent (`main`) ; description et absence de décollage précisées par Clément le 7 octobre 2026 |
| `documents/projets/nextjs-boilerplate.md` | Portfolio précédent (`main`) ; README et package.json GitHub consultés le 7 octobre 2026 ; arrêt de maintenance confirmé par Clément |
| `documents/projets/pass-gen.md` | Portfolio précédent (`main`) ; README et statut GitHub consultés le 7 octobre 2026 ; objectif d'apprentissage et arrêt de maintenance confirmés par Clément |
| `documents/projets/personal-rag.md` | CV fourni |
| `documents/projets/skytale.md` | Portfolio précédent (`main`) ; site officiel Skytale consulté le 7 octobre 2026 ; rôle frontend similaire à Ekalia et chronologie confirmés par Clément |
| `documents/projets/vision4rescue.md` | Portfolio précédent (`main`) ; sources officielles Renault consultées le 7 octobre 2026 ; utilisation de la CDP pour le pilotage des drones précisée par Clément |

## Références publiques du glossaire

Les définitions sont des synthèses en français. Le contexte relatif à Clément provient du corpus biographique ; les présentations des entreprises et des standards ne décrivent pas leurs implémentations internes. La présentation publique actuelle d'AZEOO n'est pas assimilée à son offre exacte en 2021.

| Document indexé | Références des définitions |
|---|---|
| `documents/glossaire/entreprises.md` | Thales et AZEOO : présentations officielles ci-dessous ; contexte : expériences de Clément |
| `documents/glossaire/plateformes-protocoles.md` | Thales CDP, OTAN, MIM World, DLA ASSIST et AID (CoHoMa III) ; intitulé JDSS : extrait public indexé du catalogue NISP |
| `documents/glossaire/ia.md` | Documentation officielle OpenAI, LangChain, LangGraph et Chroma ; fonctionnement de l'indexeur local |
| `documents/glossaire/ingenierie.md` | MDN, React, Next.js, Node.js, TypeScript, FastAPI, WordPress et Scrum Guide ; contexte : corpus biographique |
| `documents/glossaire/devops-data.md` | Docker, Kubernetes, GitHub Actions, PostgreSQL, MongoDB, Redis, Prisma et documentation Vercel ; workflow du dépôt |

### Entreprises et défense

- [Thales - présentation du groupe](https://careers.thalesgroup.com/global/en/about-thales/).
- [AZEOO - offre de coaching fitness et bien-être](https://azeoo.com/) : publics visés, entraînement, nutrition, réservations, communication, monétisation et applications personnalisées.
- [AZEOO - conditions professionnelles](https://azeoo.com/en/general-terms-and-conditions-of-use-professional) : confirme son activité d'éditeur et exploitant d'une plateforme SaaS web et mobile pour le coaching, le fitness et la nutrition.
- [AZEOO - mentions légales](https://www.azeoo.com/mentions-legales) : société française AZEOO SAS, immatriculée au RCS de Lyon.
- [Thales - Combat Digital Platform](https://lp.thalesgroup.com/CombatDigitalPlatform-EN).
- [OTAN - présentation de l'alliance](https://www.nato.int/en/what-is-nato).
- [DLA ASSIST - APP-6, NATO Joint Military Symbology](https://quicksearch.dla.mil/qsDocDetails.aspx?ident_number=275338) et [publication officielle OTAN APP-06](https://coi.nato.int/EWCOI/EW%20COI%20Shared%20Documents/WGs/NEWWG/EW%20Info%20Exchange%20Requirements%20Panel%20%28IERP%29/01_Governing%20Documents/Publications/APP-06%20NATO%20Symbology/APP-06%20EDE%20V1%20E.pdf) : symbologie militaire commune pour les cartes et affichages tactiques, références consultées le 7 octobre 2026. Aucune implémentation ou édition utilisée par Clément n'est déduite.
- [MIM World - introduction au MIP Information Model](https://www.mimworld.org/portal/projects/welcome/wiki/Introduction).
- [DLA ASSIST - fiche officielle STANAG 4677](https://quicksearch.dla.mil/qsDocDetails.aspx?ident_number=280661) : confirme le périmètre d'interopérabilité C4 des systèmes du combattant débarqué et la référence AEP-76.
- [Catalogue NISP, volume 2](https://nhqc3s.hq.nato.int/Apps/Architecture/NISP/pdf/NISP-Vol2-v15-release.pdf) : l'extrait public indexé fournit l'intitulé Joint Dismounted Soldier System et sa référence AEP-76/STANAG 4677. L'accès direct au PDF a renvoyé HTTP 403 ; son texte intégral n'a pas été consulté. La fiche DLA ne développe pas le sigle JDSS ; le glossaire ne déduit aucune version ni implémentation spécifique de la passerelle du CV.

- [AID - CoHoMa III : l'édition de la consolidation](https://www.defense.gouv.fr/aid/actualites/cohoma-iii-ledition-consolidation), publié le 2 juillet 2025 : définition, organisateurs, objectifs et clôture du challenge. La contribution de Clément provient de son CV.

- [AID - lancement de CoHoMa III](https://www.defense.gouv.fr/aid/actualites/battle-lab-terre-soutenu-laid-organise-troisieme-edition-du-challenge-collaboration-homme-machine), publié le 1er février 2024 : opérateurs humains, drones, robots et objectifs des expérimentations.
- [Battle Lab Terre - bilan CoHoMa III](https://www.defense.gouv.fr/terre/unites-larmee-terre/grands-commandeurs/commandement-du-combat-du-futur-ccf/section-technique-larmee-terre-2) : dix équipes et deux circuits expérimentaux.

### Ekalia

- [Ekalia - présentation officielle](https://ekalia.fr/) : structure fondée en 2011, événements principalement Minecraft, événements gratuits et soutien par les dons.
- [Ekalia - recrutement](https://ekalia.fr/join) : structure gaming gérée par une association à but non lucratif, équipe bénévole.

La description de l'association ne déduit pas de responsabilités supplémentaires pour Clément.

### Facebook Marketplace Bot

- [Dépôt GitHub et README](https://github.com/TheSn0wDev/facebook-marketplace-bot) : réponses automatiques Marketplace, première utilisation de Python indiquée par l'auteur et archivage le 3 septembre 2022.
- [Code du bot](https://github.com/TheSn0wDev/facebook-marketplace-bot/blob/master/market.bot.py) : bibliothèque fbchat, détection par règles et mots-clés, réponses configurables sur la disponibilité, la livraison, l'état et l'adresse. Le code a été lu, sans exécution ni vérification de compatibilité actuelle avec Facebook.

### Fulgur

Clément a confirmé le 7 octobre 2026 que Fulgur est toujours en développement, sur son temps personnel selon ses disponibilités.

- [Dépôt GitHub et README Fulgur](https://github.com/TheSn0wDev/fulgur) : projet de véhicule RC tout-terrain modulaire, logiciel embarqué C++, pilotage par manette, communications et caméra FPV. Les fonctionnalités sont celles présentées dans le README, sans validation matérielle ni exécution du code.

### Luma Framework

- [Dépôt Luma](https://github.com/Luma-Framework/luma) : cible GTA VI RP annoncée et licence GPL-3.0.
- [Présentation de l'organisation Luma Framework](https://github.com/Luma-Framework) : TypeScript, modularité, inspiration ESX/QBCore et évolutions annoncées. La description distingue les objectifs des fonctionnalités effectivement livrées ; aucun code n'a été exécuté.
- Clément a confirmé le 7 octobre 2026 que le développement se poursuit sur son temps personnel, selon ses disponibilités.

### My RPG

- [README du dépôt My RPG](https://github.com/TheSn0wDev/my_rpg/blob/master/README.md) : projet réalisé en équipe à la fin de la première année à Epitech, création d'un RPG dans l'univers de Diablo, langage C, bibliothèque CSFML, compilation avec Make et bande-annonce. Le README a été consulté le 7 octobre 2026 ; le jeu n'a pas été exécuté et son statut actuel n'a pas été confirmé.

### NextJS Boilerplate

- [README du dépôt](https://github.com/TheSn0wDev/nextjs-boiler-plate/blob/master/README.md) : base Next.js créée avec create-next-app et commandes de démarrage.
- [package.json](https://github.com/TheSn0wDev/nextjs-boiler-plate/blob/master/package.json) : technologies et outils inclus. Leur présence dans les dépendances ne constitue pas une validation de fonctionnalités entièrement intégrées ; le projet n'a pas été exécuté.
- Clément a confirmé le 7 octobre 2026 qu'il ne maintient plus le projet.

### pass-gen

- [README du dépôt](https://github.com/TheSn0wDev/pass-gen/blob/main/README.md) : générateur de mots de passe en Lua, longueur par défaut de 12 caractères et première utilisation du langage. Les affirmations du README sur la robustesse des mots de passe n'ont pas été reprises, faute d'audit du générateur.
- [Dépôt GitHub](https://github.com/TheSn0wDev/pass-gen) : archivage confirmé par l'API GitHub le 7 octobre 2026. Aucun code n'a été exécuté.
- Clément a confirmé l'objectif d'apprentissage de Lua et l'arrêt de maintenance le 7 octobre 2026.

### Skytale

- Clément a précisé le 7 octobre 2026 avoir rejoint Skytale peu après Ekalia, avec un rôle de développeur frontend similaire. Les dates exactes ne sont pas confirmées.
- [Site officiel Skytale](https://skytale.fr/) : studio associatif indépendant fondé en 2019, bénévolat, création de jeux et d'événements sur Minecraft, éditeur Skytale Map Editor et projet The Last Artifact. Présentation actuelle consultée le 7 octobre 2026 ; elle ne permet pas de déterminer les dates ou les responsabilités de Clément, ni de lui attribuer les réalisations du studio.

### Vision4Rescue

- Clément a précisé le 7 octobre 2026 que Vision4Rescue repose sur la CDP de Thales, notamment pour le pilotage des drones. Cette précision est reprise dans la fiche projet et l'entrée CDP du glossaire.
- [Présentation officielle Renault](https://www.renault.fr/gamme-concept-cars/vision-4rescue.html) : véhicule de commandement mobile, drones, objets connectés et coordination des secours ; partenaires de la Software République, dont Thales.
- [Communiqué Renault Group du 11 juin 2025](https://media.renaultgroup.com/la-software-republique-devoile-vision-4rescue-une-approche-technologique-integree-pour-la-nouvelle-generation-de-services-durgence/?lang=fra) : présentation à Viva Technology 2025 et conception avec des unités de sapeurs-pompiers. Ces sources décrivent le dispositif collectif et ne permettent pas d'attribuer des composants précis à Clément.

### IA et recherche documentaire

- [OpenAI - recherche documentaire et recherche hybride](https://developers.openai.com/api/docs/guides/retrieval).
- [OpenAI - API d'embeddings](https://developers.openai.com/api/reference/resources/embeddings/methods/create).
- [LangChain - présentation](https://docs.langchain.com/oss/python/langchain/overview).
- [LangGraph - présentation](https://docs.langchain.com/oss/python/langgraph/overview).
- [Chroma - introduction](https://docs.trychroma.com/docs/overview/introduction).

### Ingénierie, DevOps et données

- [MDN - glossaire du Web](https://developer.mozilla.org/en-US/docs/Glossary), [REST](https://developer.mozilla.org/en-US/docs/Glossary/REST), [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API).
- [React](https://react.dev/), [Next.js](https://nextjs.org/docs), [Node.js](https://nodejs.org/en/about), [TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html).
- [FastAPI](https://fastapi.tiangolo.com/), [WordPress](https://wordpress.org/about/), [Scrum Guide](https://scrumguides.org/scrum-guide.html).
- [Docker](https://docs.docker.com/get-started/docker-overview/), [Kubernetes](https://kubernetes.io/docs/concepts/overview/), [GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions).
- [PostgreSQL](https://www.postgresql.org/about/), [MongoDB](https://www.mongodb.com/docs/manual/), [Redis](https://redis.io/docs/latest/develop/get-started/), [Prisma](https://www.prisma.io/docs/orm/v6/overview/introduction/what-is-prisma).
- [Vercel - déploiement avec GitHub Actions](https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel).

Les définitions générales de métiers, de langages, d'architecture et de pratiques sont des explications pédagogiques ; elles n'ajoutent pas de certification, de niveau de maîtrise ou de réalisation au parcours de Clément.

Le 7 octobre 2026, Clément a précisé qu'Atlantique RP était un serveur FiveM de GTA V RP, dans un univers français situé sur l'île d'Oléron, et que le projet est aujourd'hui abandonné. Cette précision complète la fiche projet, le glossaire et les expériences. Aucune fonctionnalité supplémentaire n'est déduite de ce contexte.

Le 7 octobre 2026, Clément a précisé que Code Sandbox est un outil interne basé sur VS Code, embarquant directement le SDK cartographique et une vue web avec rendu en direct. Il permet de coder dans l'outil et de vérifier l'origine des bugs du SDK entre des projets aux bases de code différentes. Cette précision enrichit la fiche projet, le glossaire et les expériences. Le nom du SDK, son architecture interne et les résultats des benchmarks restent non précisés.

## Indexation

Les documents sont prêts pour `pnpm index:documents`. L'index vectoriel n'a pas été régénéré dans cette opération ; il nécessite une clé OpenAI pour les nouveaux passages.

Ce fichier de provenance reste hors de `documents/` et n'est pas indexé.

## Harmonisation du portfolio du 7 octobre 2026

Clément confirme ChromaDB et le dépôt project-brain pour Personal RAG, l’étude d’AWS à Laval, l’utilisation de Kubernetes chez Thales CDP et sa formation en cours sur GCP. Les dates exactes de Skytale et Ekalia restent non confirmées. Le portfolio reprend les contributions documentées et distingue les projets actifs, archivés et les fonctionnalités annoncées.

## Vision4Rescue : précision du 8 octobre 2026

Clément confirme son travail actuel sur la CDP et sa contribution à Vision4Rescue pendant CoHoMa III. La carte projet et les documents reprennent cette participation sans attribuer de composants ni de résultats supplémentaires.

## Contributions précisées le 8 octobre 2026

Précisions directement fournies par Clément, prioritaires sur les mentions antérieures de périmètre inconnu :

- Vision4Rescue et CoHoMa III : mêmes composants, dont le frontend des interfaces de pilotage ; fiches et expériences harmonisées.
- Djise : CEO, développement seul de l’ensemble du site avec Next.js, NestJS et Stripe ; développement terminé, projet archivé. La deuxième réponse est rattachée à Djise selon l’ordre des projets discutés.
- Luma : développeur, projet très préliminaire faute d’informations sur le RP de GTA VI ; anticipation et apprentissage de la programmation orientée objet.
- My RPG : quatre développeurs d’Epitech ; interfaces, animations, combats et inventaire pour Clément.
- Next Citizens : premières bases d’architecture, gestion de la base de données et début du système d’économie.
- NextJS Boilerplate : ensemble développé par Clément pour regrouper les bibliothèques réutilisées et gagner du temps dans ses projets Next.js.
- Personal RAG : assistant générique destiné aux projets en cours pour les comprendre et demander des conseils ; intégration partout décrite comme objectif.

### Fulgur : consultation du dépôt via le connecteur GitHub

Lecture le 8 octobre 2026 du README, de l’arborescence et du code de la branche main, sans compilation ni exécution :

- [Contrôleur C++](https://github.com/TheSn0wDev/fulgur/blob/main/fulgur-controller/src/main.cpp) et [PS5Controller](https://github.com/TheSn0wDev/fulgur/blob/main/fulgur-controller/src/controller/PS5Controller.cpp) : SDL3, boutons, axes, batterie et publication JSON sur NATS.
- [Bus NATS](https://github.com/TheSn0wDev/fulgur/blob/main/fulgur-messaging/src/NatsMessagingBus.cpp) : publication et abonnement ; JetStream non implémenté.
- [Viewer](https://github.com/TheSn0wDev/fulgur/blob/main/fulgur-viewer/src/App.tsx) et [dépendances](https://github.com/TheSn0wDev/fulgur/blob/main/fulgur-viewer/package.json) : React, TypeScript, NATS WebSocket, Zustand, Vite et Tailwind CSS ; batterie affichée avec une valeur fixe.
- [Lecteur vidéo](https://github.com/TheSn0wDev/fulgur/blob/main/fulgur-viewer/src/components/WebRTCPlayer.tsx) : WebRTC/WHEP et reconnexion.

La fiche distingue code présent et périmètre annoncé ; le fonctionnement sur véhicule et l’auteur de chaque ligne ne sont pas vérifiés.

## Compléments confirmés par Clément le 8 octobre 2026

Ces précisions remplacent les mentions antérieures d’absence d’information sur les points concernés :

- Atlantique RP : développement de scripts / mods de création d’identité, en complément du rôle de lead.
- MMA Scan : sources publiques UFC Stats, ESPN et FightMatrix ; contexte des deux combattants transmis à l’IA pour analyser les statistiques et prédire gagnant, méthode et round. Clément rapporte environ 90 % de gagnants correctement prédits et une bonne précision non chiffrée sur méthode et round ; échantillon et protocole non précisés. Usage personnel ponctuel pour confronter ses paris sportifs aux analyses. Aucun rendement financier ni validation indépendante n’est déduit.
- Personal RAG : fonctionnalités confirmées comme opérationnelles, dont reranking et agents ; intégration au portfolio et à MMA Scan confirmée. Cette confirmation ne signifie pas que toutes les fonctions ou la même stack sont utilisées dans chaque intégration.
- Fulgur : Raspberry Pi Zero 2 W, composants de voiture à monter, moteur brushless, servomoteurs et caméra Raspberry Pi v2. Aucun état d’assemblage ni essai matériel supplémentaire n’est déduit.
- Thales CDP : périmètres Combat, TEWA, BSO et JDSS ; Kubernetes pour tester et déboguer l’environnement Azure. Les sigles TEWA et BSO sont conservés sans développement non confirmé.
- Ekalia : période 2018-2019 confirmée ; menu de navigation, page d’accueil et interfaces de gestion des équipes.
- Skytale : année 2019 confirmée ; réalisation d’une landing page.

Les fiches, expériences, compétences et le glossaire Kubernetes/Azure sont harmonisés. Les documents sont modifiés ; l’index vectoriel n’a pas été régénéré lors de cette mise à jour.


## Ajout de LevelPilot — 8 octobre 2026

Clément confirme développer LevelPilot avec un collègue chargé du frontend et prendre en charge le backend. La fiche projet, le profil et les compétences sont enrichis à partir de cette confirmation et de la lecture du code, de la documentation et de l’historique local. Clément précise que l’agent peut fonctionner de manière 100 % autonome selon la configuration de l’utilisateur, avec notamment création de PR et rollback automatiques. Cette précision complète la lecture du code local et fait autorité pour la présentation du projet. Aucun gain de KPI ou déploiement en production n’est déduit. L’index vectoriel n’a pas été régénéré lors de cet ajout.
