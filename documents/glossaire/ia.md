# Glossaire - Intelligence artificielle et RAG

## IA / AI - Intelligence artificielle

L'intelligence artificielle regroupe des méthodes qui permettent à des systèmes d'effectuer des tâches comme reconnaître, prédire, recommander ou générer. AI est le sigle anglais d'Artificial Intelligence.

## GenAI - Generative AI

La GenAI, ou intelligence artificielle générative, produit du contenu comme du texte, des images ou du code. C'est une spécialisation de l'IA. Le profil de Clément Ozor mentionne une spécialisation backend et GenAI.

## GenAI Engineer

Un GenAI Engineer se concentre sur les applications d'IA générative, par exemple les assistants, les RAG et les agents. Clément souhaite évoluer vers ce rôle, à partir de son expérience backend et de ses projets personnels en GenAI. Les intitulés varient selon les entreprises ; ils ne prouvent pas à eux seuls une expérience d'entraînement de modèles.

## LLM - Large Language Model

Un LLM est un grand modèle de langage entraîné sur de nombreux exemples pour traiter et générer du texte. Il peut produire une réponse plausible mais incorrecte. Le projet MMA Scan de Clément Ozor utilise des LLM pour des analyses de combats.

## Prompt et prompt engineering

Un prompt est le contenu transmis à un modèle pour orienter sa réponse : consigne, question, contexte et exemples. Le prompt engineering consiste à concevoir et évaluer ces éléments pour obtenir un comportement adapté.

## RAG - Retrieval-Augmented Generation

Le RAG combine la recherche d'informations dans un corpus et la génération d'une réponse par un modèle IA à partir des passages retrouvés. Il n'entraîne pas nécessairement le modèle sur les documents et ne garantit pas l'exactitude. Personal RAG est un projet décrit dans le CV de Clément Ozor ; le chat RAG de la v3 du portfolio reste à construire.

## Corpus et chunk

Un corpus est l'ensemble des documents consultables. Un chunk est un passage issu du découpage d'un document. Dans le portfolio v3, les documents Markdown sont découpés en passages avant le calcul des embeddings.

## Embedding / plongement vectoriel

Un embedding représente un contenu sous la forme d'un vecteur de nombres. Comparer ces vecteurs permet de rechercher des contenus proches par leur sens. Les embeddings ne sont ni un chiffrement ni une copie exacte du texte. L'indexeur du portfolio v3 prévoit des embeddings OpenAI.

## Recherche sémantique et similarité

La recherche sémantique retrouve des contenus proches du sens d'une question, même s'ils n'utilisent pas les mêmes mots. Une mesure de similarité, comme la similarité cosinus, compare les vecteurs. Un score proche ne garantit pas qu'un passage répond correctement à la question.

## Recherche lexicale et recherche hybride

La recherche lexicale s'appuie sur les mots présents dans les textes. La recherche hybride combine cette approche avec la recherche sémantique. Elle peut aider à retrouver à la fois des formulations proches et des termes exacts, comme un sigle. Personal RAG mentionne la recherche hybride dans le CV.

## Reranking / reclassement

Le reranking réévalue les résultats d'une première recherche pour mieux les ordonner selon leur pertinence pour la question. Il intervient après la récupération initiale des passages. Le CV de Clément Ozor le mentionne dans Personal RAG.

## Seuil de pertinence

Un seuil de pertinence permet d'écarter des résultats dont le score de recherche est jugé trop faible. Il doit être ajusté et évalué sur le corpus ; il ne constitue pas une garantie de vérité.

## Agent IA et orchestration

Un agent IA utilise un modèle pour choisir des actions et éventuellement appeler des outils, par exemple une recherche documentaire ou une API. L'orchestration organise les étapes, les outils et les échanges entre composants ou agents. Les agents nécessitent des limites et une évaluation adaptées.

## LangChain

LangChain est un framework qui fournit des composants et des intégrations pour construire des applications et des agents utilisant des modèles de langage. Il est cité dans la stack du projet Personal RAG.

## LangGraph

LangGraph est un framework et un runtime d'orchestration de workflows et d'agents avec état. Il permet de combiner des étapes programmées et des décisions pilotées par un modèle. LangGraph figure dans les compétences du CV ; son usage précis dans un projet n'y est pas détaillé.

## ChromaDB / Chroma

Chroma est une infrastructure de recherche pour l'IA qui permet notamment de stocker des embeddings, des contenus et leurs métadonnées, puis de rechercher des informations pertinentes. ChromaDB est cité dans la stack de Personal RAG, pas dans l'architecture actuelle du portfolio v3.

## OpenAI

OpenAI fournit notamment des modèles de génération et d'embeddings accessibles via API. Le portfolio v3 utilise une commande d'indexation prévue pour le modèle text-embedding-3-small. La clé API reste côté serveur ou dans l'environnement d'indexation.

## Indexation incrémentale et SHA-256

L'indexation incrémentale recalcule les données d'index uniquement pour les contenus nouveaux ou modifiés. SHA-256 est une fonction de hachage qui produit une empreinte à partir d'un contenu ; elle sert ici à détecter les changements et n'est pas un chiffrement. Personal RAG et l'indexeur de la v3 utilisent ce principe.

## Citations, traçabilité et hallucination

Une citation identifie le passage ou document utilisé dans une réponse. La traçabilité permet de retrouver son origine. Une hallucination est une réponse inventée ou non étayée produite par un modèle. Le RAG et les citations facilitent la vérification, mais une citation peut aussi être incorrecte.
