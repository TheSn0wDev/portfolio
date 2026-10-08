# Glossaire - Plateformes, standards et interopérabilité

## CDP - Combat Digital Platform

La Combat Digital Platform est une plateforme numérique de Thales destinée au commandement et au combat collaboratifs. Sa présentation publique décrit le partage et l'exploitation de données tactiques pour améliorer la compréhension de la situation et la coordination.

Clément Ozor développe des services backend en Go au sein de la CDP chez Thales. Cette définition publique ne décrit pas son architecture interne.

La CDP est également utilisée dans Vision4Rescue, notamment pour piloter les drones et coordonner les équipements du dispositif de secours.

## APP-6 / APP-06 - NATO Joint Military Symbology

APP-6 est la publication de l'OTAN qui définit une symbologie militaire commune : des symboles graphiques pour représenter les unités, les équipements, les installations et les activités sur des cartes ou des écrans tactiques.

Les formes, les couleurs et les indications complémentaires permettent notamment de reconnaître l'affiliation d'un élément (ami, hostile, neutre ou inconnu), son type et certaines de ses caractéristiques. Cette représentation commune facilite la lecture et le partage d'une situation opérationnelle entre forces alliées.

APP-6 est un standard de représentation graphique, distinct des protocoles d'échange de données. Plusieurs éditions existent ; aucune édition ni utilisation précise par Clément n'est confirmée dans le corpus.

## OTAN / NATO

OTAN signifie Organisation du traité de l'Atlantique Nord ; NATO est son sigle anglais. Cette alliance politique et militaire réunit des pays d'Europe et d'Amérique du Nord. Ses travaux de standardisation contribuent à rendre les systèmes de ses membres interopérables.

## JDSS - Joint Dismounted Soldier System

JDSS désigne le contexte des systèmes du combattant débarqué et de leur interopérabilité. La famille de spécifications AEP-76, associée au STANAG 4677, traite des standards et protocoles de commandement, de contrôle, de communications et d'informatique pour ces systèmes. JDSSIN désigne le Joint Dismounted Soldier System Interoperability Network.

Le CV de Clément Ozor cite JDSS dans une passerelle d'interopérabilité avec MIM. Il ne précise pas l'édition des spécifications ni les détails techniques de cette passerelle.

## MIM - MIP Information Model

MIM signifie MIP Information Model. Ce modèle fournit un vocabulaire et une structure communs pour représenter les informations du domaine du commandement et du contrôle. Il permet aux systèmes d'attribuer le même sens aux données échangées et n'est pas lié à une technologie de transport unique.

Le CV de Clément Ozor cite MIM dans son travail de passerelle d'interopérabilité avec JDSS.

## MIP - Multilateral Interoperability Programme

Le Multilateral Interoperability Programme est un programme multinational de standardisation militaire à l'origine du MIP Information Model. Il contribue à l'interopérabilité des systèmes d'information de commandement et de contrôle.

## STANAG - Standardization Agreement

Un STANAG est un accord de normalisation de l'OTAN. Il définit un cadre commun destiné à faciliter la compatibilité et l'interopérabilité. STANAG 4677 concerne l'interopérabilité des systèmes du combattant débarqué.

## C2 / C4

C2 signifie Command and Control : commandement et contrôle. C4 ajoute Communications and Computers : communications et informatique. Ces termes décrivent des fonctions, pas un produit ni un protocole unique.

## Interopérabilité

L'interopérabilité est la capacité de systèmes différents à échanger des informations et à les utiliser correctement. Elle exige de s'accorder sur les formats, les moyens d'échange et le sens des données. Le travail de Clément Ozor sur une passerelle JDSS/MIM relève de cette problématique.

## Protocole, modèle d'information et passerelle

Un protocole définit des règles d'échange entre systèmes. Un modèle d'information décrit la structure et le sens des données. Une passerelle relie des systèmes et peut traduire leurs messages ou leurs représentations. Dans ce contexte, MIM est un modèle d'information ; le terme protocole ne décrit donc pas à lui seul tous les éléments d'une intégration JDSS/MIM.

## Challenge CoHoMa III - Collaboration Homme-Machine

CoHoMa signifie Collaboration Homme-Machine. CoHoMa III est la troisième édition de ce challenge, organisée par le Battle Lab Terre avec le soutien de l'Agence de l'innovation de défense. Elle s'est achevée le 30 juin 2025.

Le challenge expérimente sur le terrain la collaboration entre les forces terrestres et des systèmes autonomes, téléopérés ou supervisés. Il porte notamment sur la robotique, les interfaces homme-machine, la fusion de données et la résilience des systèmes.

Clément Ozor a travaillé dans le cadre de CoHoMa III chez Thales, comme Robotics Software Engineer de mars à septembre 2025, sur l'intégration robotique, le streaming vidéo temps réel, le replay et les données multi-capteurs.
