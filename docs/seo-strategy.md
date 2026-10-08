# SEO du portfolio

## Positionnement

Développeur backend et IA générative, avec un accent sur les agents IA autonomes et le RAG. L'expérience professionnelle chez Thales et les projets personnels GenAI sont distingués. Objectif : recevoir des contacts pertinents pour une mission longue backend et/ou GenAI, via portage salarial, début 2027, en présentiel en Île-de-France, en hybride ou entièrement à distance.

## Pages et intentions

| Chemin après /fr ou /en | Intention | Source |
| --- | --- | --- |
| Accueil | Clément Ozor, développeur backend et IA générative | src/content/profile.ts |
| /personal-rag | Développement RAG Python, assistant documentaire sourcé | documents/projets/personal-rag.md |
| /agents-ia-autonomes | Orchestration d'agents autonomes, workflows backend | documents/projets/levelpilot.md |
| /mission-genai | Backend / GenAI Engineer, Île-de-France ou à distance, modalités et contact | documents/profil.md |

Chaque page dispose d'un contenu et d'un objectif distincts. Les traductions partagent le même slug. Ne pas créer de variantes par ville ou technologie sans une réalisation spécifique. Le contenu bilingue est centralisé dans src/content/seo-pages.ts. Les liens depuis l'accueil et entre les pages évitent les pages isolées.

## Domaine et lancement

1. Dans Vercel, définir SITE_URL avec l'origine HTTPS définitive, sans chemin, par exemple le domaine personnalisé réellement choisi. Aucun domaine personnalisé n'est inventé dans le code.
2. Sans SITE_URL, VERCEL_PROJECT_PRODUCTION_URL sert de domaine stable. Le domaine temporaire VERCEL_URL n'est jamais utilisé. Si le domaine définitif change, mettre à jour SITE_URL et reconstruire le site.
3. Le développement local utilise http://localhost:3000. Un déploiement Vercel Production sans origine configurée échoue explicitement.
4. Les previews sont noindex. Le robots.txt de production autorise les pages et exclut /api/. Le sitemap contient uniquement les huit URL canoniques, avec alternates réciproques et x-default français.
5. Les URL /fr et /en restent accessibles directement. Le choix de langue à la racine est conservé ; x-default pointe vers /fr pour éviter une cible adaptative.
6. Déclarer le domaine dans Google Search Console et soumettre /sitemap.xml. Inspecter les huit URL et leur HTML rendu, puis demander l'indexation si nécessaire.
7. Tester les données structurées avec Rich Results Test : ProfilePage à l'accueil, BreadcrumbList sur les pages détaillées. L'affichage enrichi n'est pas garanti.
8. Vérifier PageSpeed Insights après déploiement. Aucun score Core Web Vitals n'est annoncé sans mesure.

## Preuves et suivi

Aucun volume de recherche ni classement n'est garanti. Valider les groupes de mots-clés dans Keyword Planner ciblé sur la France ; la concurrence publicitaire n'est pas la difficulté organique. Suivre ensuite les impressions, clics et positions par page et requête dans Search Console, puis les prises de contact.

Les animations de projets utilisant des valeurs numériques portent une mention illustrative. Ne publier des résultats de qualité RAG, latence, coût ou gains de rétention qu'avec un protocole et des mesures vérifiables. Les projets en développement restent décrits comme tels.

Pour renforcer la découverte, ajouter les URL pertinentes au profil LinkedIn et aux README GitHub, lorsque leur publication est décidée. Ces profils externes ne sont pas modifiés par cette implémentation.
