# Clément Ozor - Projet Fulgur

## Présentation

Fulgur est un projet open source de véhicule radiocommandé tout-terrain, conçu comme une plateforme modulaire pour expérimenter en robotique et en systèmes embarqués. Il associe du logiciel embarqué en C++ à une architecture matérielle adaptable, permettant de faire évoluer les capteurs, les moteurs et les modes de commande.

Le README présente notamment le pilotage sans fil par manette, des communications en temps réel et la prise en charge d'une caméra embarquée pour une vue à la première personne (FPV). L'architecture sépare la logique de contrôle, les communications et les pilotes matériels.

Dépôt : https://github.com/TheSn0wDev/fulgur.

## Développements présents dans le projet de Clément

La lecture du dépôt public précise le travail logiciel présent :

- Contrôleur C++ avec SDL3 pour lire les boutons, axes et informations de batterie d’une manette, avec une implémentation PS5, et publier son état en JSON sur NATS.
- Abstraction de bus de messagerie et implémentation NATS en C++ pour la publication et l’abonnement.
- Interface React et TypeScript recevant les états de manette et les informations du véhicule via NATS sur WebSocket, avec Zustand pour la gestion d’état.
- Lecteur vidéo WebRTC utilisant WHEP, avec tentative de reconnexion.
- Modules controller, messaging, logger, pinger, telemetry et viewer ; compilation des composants C++ organisée avec CMake.

Stack observée : C++, SDL3, NATS, JSON, CMake, React, TypeScript, Vite, Tailwind CSS, Zustand, WebSocket, WebRTC et WHEP.

Le code a été lu sans compilation ni exécution. JetStream n’est pas implémenté dans le bus NATS et la batterie affichée dans le viewer reçoit encore une valeur fixe. Le montage matériel, la commande des moteurs et le fonctionnement complet sur véhicule restent à confirmer. Cette lecture ne vérifie pas l’auteur de chaque ligne.

## Technologies annoncées dans le README

C++ embarqué, SDL3 pour les entrées des manettes, WebSocket, UDP et liaison série pour les communications. Le README mentionne aussi des intégrations optionnelles avec Raspberry Pi, ESP32 ou d'autres microcontrôleurs.

## Statut documenté

Fulgur est toujours en cours de développement. Clément Ozor y travaille sur son temps personnel, lorsqu'il en a la disponibilité.

Les fonctionnalités ci-dessus décrivent le périmètre présenté dans le README ; leur fonctionnement sur un véhicule réel n'a pas été vérifié.
