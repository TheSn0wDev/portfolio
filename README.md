# Portfolio v3

Next.js App Router + React + TypeScript, pour un déploiement Vercel.
Les routes `/api/health` et `/api/chat` sont disponibles. Le backend RAG est implémenté ;
le widget de chat est branché sur le backend sans modification de son interface.
Le backend Python et Vite ont été retirés.

## Développement

Node.js 22 et pnpm 10.32.0.

```sh
pnpm install
pnpm dev
```

```sh
pnpm lint
pnpm typecheck
pnpm test:index
pnpm test:rag
pnpm test:chat-client
pnpm build
pnpm start
```

## Documents et indexation OpenAI

Placer les documents dans `documents/` : `.md` ou `.txt`, sous-dossiers inclus.
Les PDF ne sont pas pris en charge ; convertir leur contenu en texte avant indexation.
Les fichiers cachés et les liens symboliques sont ignorés.

`documents/glossaire/` contient les définitions des entreprises, standards et termes
techniques. Les références publiques sont centralisées dans `docs/corpus-sources.md`,
hors du corpus indexé. Les définitions générales ne constituent pas de nouvelles
réalisations attribuées à Clément.

```sh
cp .env.example .env.local
# Renseigner OPENAI_API_KEY dans .env.local.
pnpm index:documents
```

Le script découpe les documents en passages de 1 800 caractères Unicode maximum,
avec un recouvrement de 200 caractères, puis appelle OpenAI `text-embedding-3-small`
(1 536 dimensions). Les passages inchangés réutilisent leurs embeddings ; les passages
supprimés disparaissent du nouvel index. Sans document, aucune clé ni requête n’est nécessaire.
Une erreur API laisse l’index précédent intact et fait échouer la commande.

L’index `data/rag-index.json` contient textes, sources et vecteurs. Il peut être committé
après une indexation locale pour utiliser le déploiement Git automatique de Vercel.
Il contient donc le contenu des documents : n’y placer que le corpus destiné au portfolio.
Il est importable via `src/lib/rag/index.ts`, protégé par `server-only`, et ne se trouve
pas dans `public/`. Le build ne déclenche pas l’indexation et n’appelle pas OpenAI.

## Backend RAG

`POST /api/chat` accepte `{ "question": "..." }`, avec `history` et `stream` facultatifs.
BotID Basic protège cette route : initialisation navigateur dans `src/instrumentation-client.ts`,
rewrites via `withBotId` et vérification serveur avant les appels Redis/OpenAI.
Les bots détectés reçoivent une réponse 403. Le niveau `basic` est explicite des deux côtés.
La protection réelle s'applique après déploiement sur Vercel ; en développement, BotID
autorise les requêtes par défaut (le `curl` ci-dessous sert au test local).
Recherche hybride cosinus + BM25, quatre extraits maximum (~1 800 tokens), une génération
Responses API (`gpt-4.1-mini-2025-04-14`, configurable), sources citées et streaming SSE.
Réponse plafonnée à 350 tokens ; historique borné à 600 tokens. Les instructions et
la question s'ajoutent au budget d'extraits. Les documents sont des données non fiables,
et le glossaire ne doit jamais devenir une réalisation attribuée à Clément.

Redis Upstash fournit le cache partagé (24 h), les quotas par IP (20/min, 100/24 h)
et le plafond global (500 traitements payants/jour UTC par environnement).
Configurer `UPSTASH_REDIS_REST_URL` et `UPSTASH_REDIS_REST_TOKEN` en production.
Sans Redis, le backend refuse les requêtes en production ; en développement, il utilise
un quota mémoire local et désactive le cache. Les limites sont configurables dans
`.env.example`. Les logs mesurent tokens et latence sans enregistrer le contenu.

**Documentation complète : [indexation, stockage, cache et déploiement](docs/rag-backend.md).**
Elle détaille les fichiers inchangés, modifications, suppressions, renommages et erreurs.
Le widget envoie toutes les questions à cette API, y compris les suggestions, avec
les quatre derniers messages réussis. Une nouvelle conversation annule la requête
en cours et efface cet historique. L’animation de réponse existante est conservée.

```sh
curl -s http://localhost:3000/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"question":"Quel est le projet Vision4Rescue ?"}'
```

## GitHub Actions → Vercel

`.github/workflows/index-and-deploy.yml` s’exécute à chaque push et peut être lancé manuellement.
Il teste le script et le RAG, génère l’index, vérifie le code et conserve l’index comme artifact pendant
7 jours. Un cache réutilise les embeddings entre les exécutions. Les pull requests
exécutent uniquement les tests et le build, sans appel OpenAI ni déploiement.

Ajouter les secrets du dépôt GitHub :

- `OPENAI_API_KEY` : obligatoire dès qu’il faut générer de nouveaux embeddings.
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` : nécessaires pour le déploiement.

Les identifiants du projet se récupèrent en liant le dépôt au projet Vercel (`vercel link`).
Choisir le preset Next.js et la racine du dépôt dans Vercel, sans ancien output `dist`.
Configurer aussi `OPENAI_API_KEY`, `UPSTASH_REDIS_REST_URL` et
`UPSTASH_REDIS_REST_TOKEN` côté serveur dans Vercel pour le chat.

Avec les trois secrets Vercel, l’Action construit puis déploie l’application avec l’index
généré dans la même exécution (`vercel build`, puis `vercel deploy --prebuilt`). La branche
par défaut du dépôt déploie en production ; les autres branches déploient en preview.
Sans secrets Vercel, l’Action vérifie simplement le build et conserve l’artifact, sans déployer.
L’Action ne committe pas l’index dans le dépôt.

**Choisir un seul circuit de déploiement :**

- Indexation locale : committer l’index avec les documents, puis utiliser l’intégration Git Vercel.
- Indexation GitHub Actions : désactiver/déconnecter l’intégration Git automatique Vercel et
  laisser cette Action déployer. Un artifact GitHub seul n’est pas récupéré par un build Git Vercel.

Documentation : [embeddings OpenAI](https://developers.openai.com/api/reference/resources/embeddings/methods/create)
et [GitHub Actions avec Vercel](https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel).


### Langues

Le portfolio est disponible sur `/fr` et `/en`. La route `/` redirige vers la préférence enregistrée dans le cookie `portfolio-locale`, puis vers la langue principale du navigateur (français par défaut). Le sélecteur du header conserve l’ancre courante.

Les contenus français restent dans `src/content`. Les traductions anglaises sont dans `src/i18n/en.json` ; les composants partagent le contexte `LocaleProvider`. Les pages sont pré-rendues avec une langue HTML et des métadonnées propres, ainsi que des liens alternatifs `hreflang`.

Le chat transmet `locale` à `/api/chat`. La langue de la page impose la langue des réponses, des abstentions et des erreurs ; les clés de cache incluent cette langue. Le changement de langue démarre une nouvelle conversation.

Validation : `pnpm test:locale`, `pnpm test:chat-client`, `pnpm test:rag`.

### Choisir l’adresse publique

L’adresse publique est le domaine sur lequel le portfolio sera consulté. Pour ce profil, `clementozor.fr` est un choix lisible pour une cible française, sous réserve de disponibilité. Le projet peut d’abord utiliser l’adresse stable `.vercel.app` attribuée par Vercel.

Après achat et configuration du domaine dans Vercel, renseigner `SITE_URL` avec son origine HTTPS réelle, puis redéployer. Ne pas renseigner un domaine proposé avant qu’il soit associé au projet. Vérifier ensuite les canoniques, `/sitemap.xml`, les images `/og` et l’indexation dans Search Console. Les performances PageSpeed doivent être mesurées sur cette adresse publique.
