# Clément Ozor - Projet Fulgur

## Présentation

Fulgur est un projet open source de véhicule radiocommandé tout-terrain, conçu comme une plateforme modulaire pour expérimenter en robotique et en systèmes embarqués. Il associe du logiciel embarqué en C++ à une architecture matérielle adaptable, permettant de faire évoluer les capteurs, les moteurs et les modes de commande.

Le README présente notamment le pilotage sans fil par manette, des communications en temps réel et la prise en charge d'une caméra embarquée pour une vue à la première personne (FPV). L'architecture sépare la logique de contrôle, les communications et les pilotes matériels.

Dépôt : https://github.com/TheSn0wDev/fulgur.

## Technologies présentées

C++ embarqué, SDL3 pour les entrées des manettes, WebSocket, UDP et liaison série pour les communications. Le README mentionne aussi des intégrations optionnelles avec Raspberry Pi, ESP32 ou d'autres microcontrôleurs.

## Statut documenté

Fulgur est toujours en cours de développement. Clément Ozor y travaille sur son temps personnel, lorsqu'il en a la disponibilité.

Les fonctionnalités ci-dessus décrivent le périmètre présenté dans le README ; leur fonctionnement sur un véhicule réel n'a pas été vérifié.
