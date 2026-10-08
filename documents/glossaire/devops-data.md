# Glossaire - DevOps, cloud et données

## Git et gestion de versions

Git est un système de gestion de versions qui conserve l'historique des modifications du code et facilite le travail en équipe. Une branche permet de développer une évolution séparément ; un commit enregistre un état des modifications.

## GitHub, GitLab et Bitbucket

GitHub, GitLab et Bitbucket sont des plateformes d'hébergement et de collaboration autour de dépôts Git. Elles ne sont pas des langages de programmation. Le parcours de Clément Ozor mentionne GitLab CI chez Thales, GitHub Actions pour MMA Scan et Bitbucket chez AZEOO.

## CI/CD - Continuous Integration / Continuous Delivery ou Deployment

La CI automatise des vérifications lors de l'intégration du code. La livraison continue prépare des versions déployables ; le déploiement continu les publie automatiquement. Une pipeline enchaîne ces étapes selon des règles.

## GitHub Actions et GitLab CI

GitHub Actions et GitLab CI exécutent des workflows automatisés, comme des tests, un build ou un déploiement. Dans le portfolio v3, un workflow GitHub Actions est préparé pour indexer les documents à chaque push puis déployer sur Vercel lorsque les secrets requis sont configurés.

## Build et artifact

Un build transforme le code source en éléments utilisables pour exécuter ou déployer l'application. Un artifact est un fichier conservé à l'issue d'un workflow, par exemple un index documentaire ou un résultat de compilation. Un artifact GitHub n'est pas automatiquement disponible dans un déploiement Vercel indépendant.

## Docker et conteneur

Docker fournit des outils pour créer et exécuter des conteneurs. Un conteneur regroupe une application et son environnement d'exécution avec une isolation de processus ; il n'est pas équivalent à une machine virtuelle complète. Docker figure dans les expériences Thales de Clément Ozor.

## Kubernetes

Kubernetes est une plateforme d'orchestration de conteneurs qui organise leur déploiement, leur fonctionnement et leur mise à l'échelle. Clément utilise Kubernetes chez Thales sur la Combat Digital Platform pour déboguer et tester l’environnement Azure. Aucun niveau de maîtrise chiffré n’est précisé.

## Cloud, AWS, Azure et GCP

Le cloud fournit des ressources informatiques accessibles à distance, comme du calcul, du stockage et des services gérés. AWS signifie Amazon Web Services ; Azure est la plateforme cloud de Microsoft ; GCP signifie Google Cloud Platform. Dans le parcours de Clément, AWS a été étudié à l’Université Laval, Azure est l’environnement qu’il teste et débogue avec Kubernetes chez Thales CDP, et GCP fait l’objet d’une formation en cours.

## Vercel et serverless

Vercel est une plateforme de déploiement web utilisée pour la v3 du portfolio Next.js. Le serverless confie au fournisseur la gestion de l'infrastructure d'exécution et son adaptation à la charge ; des serveurs existent toujours. Les fonctions peuvent avoir des limites de durée et de ressources.

## PostgreSQL et MySQL

PostgreSQL et MySQL sont des systèmes de gestion de bases de données relationnelles utilisant SQL. Ils permettent notamment de stocker des données structurées et d'exécuter des requêtes. PostgreSQL figure dans le CV ; MySQL apparaît dans le portfolio précédent.

## MongoDB

MongoDB est une base de données orientée documents. Les données y sont organisées en documents et collections, avec une structure différente du modèle relationnel classique. MongoDB figure dans les compétences du CV.

## Redis

Redis est un système de stockage de données souvent utilisé pour des accès rapides, du cache ou des échanges de messages. Il propose plusieurs structures de données et des mécanismes de persistance. Redis figure dans les compétences du CV, sans usage de projet précisé.

## Base vectorielle

Une base vectorielle stocke des vecteurs et permet de rechercher ceux qui sont proches d'un vecteur de requête. Elle peut associer textes et métadonnées aux embeddings. Personal RAG mentionne ChromaDB ; le petit corpus de la v3 prévoit un fichier JSON côté serveur plutôt qu'une base vectorielle externe.

## Prisma / ORM

Un ORM, Object-Relational Mapping, facilite les interactions entre du code applicatif et une base relationnelle. Prisma fournit notamment des outils de schéma, de migrations et un client de requêtes typé. Prisma apparaît dans le portfolio précédent.

## JSON et métadonnées

JSON signifie JavaScript Object Notation : c'est un format textuel d'échange de données. Les métadonnées décrivent un contenu, par exemple son origine ou son identifiant. L'index JSON du portfolio conserve notamment le texte, la source et les embeddings de chaque passage.

## Variable d'environnement et secret

Une variable d'environnement configure un programme sans modifier son code. Une clé API est un secret d'authentification. Dans le portfolio, OPENAI_API_KEY doit rester dans l'environnement local, les secrets GitHub ou l'environnement serveur Vercel ; elle ne doit pas être exposée au navigateur.
