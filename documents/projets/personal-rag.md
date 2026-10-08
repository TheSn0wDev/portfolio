# Clément Ozor - Projet Personal RAG

Personal RAG est un projet d'assistant RAG décrit dans le CV de Clément Ozor.

## Objectif

Clément conçoit Personal RAG comme un assistant générique destiné à être intégré à tous ses projets en cours pour mieux les comprendre et demander des conseils contextualisés. Il doit être réutilisable par réindexation des documents du projet concerné, avec une interface de chat et une API. L’intégration à tous ses projets est un objectif ; son déploiement effectif dans chacun n’est pas documenté.

## Fonctionnalités décrites dans le CV

- Indexation incrémentale par empreintes SHA-256.
- Synchronisation des documents et stockage vectoriel persistant.
- Recherche sémantique avec seuil de pertinence.
- Génération contextualisée avec citations et traçabilité des sources.
- Recherche hybride, reranking et orchestration d'agents pour enrichir la pertinence des réponses.

## Stack

Python, FastAPI, LangChain, ChromaDB et OpenAI.

Dépôt confirmé par Clément : https://github.com/TheSn0wDev/project-brain.

Les dates du projet ne sont pas précisées. Personal RAG est distinct du chantier d'intégration du RAG dans la v3 du portfolio.
