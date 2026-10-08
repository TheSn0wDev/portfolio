import type { Locale } from '@/i18n/locale'
import type { SeoSection } from './seo-pages'

export const seoDemos: Record<Locale, Record<string, SeoSection>> = {
  fr: {
    'personal-rag': {
      heading: 'Essayez le RAG de ce portfolio',
      paragraphs: [
        'Le chat en haut de l’accueil interroge la documentation de mon profil et de mes projets. Posez une question, puis consultez les références affichées avec la réponse pour examiner les sources utilisées.',
        'Cette démonstration utilise le backend propre au portfolio. Elle permet d’examiner une expérience RAG en fonctionnement ; elle ne constitue ni un benchmark du dépôt Python Personal RAG, ni une garantie de réponse correcte.',
      ],
      bullets: [
        'Demandez : « Quel est ton rôle chez Thales et sur quelle stack travailles-tu ? » Comparez la réponse aux documents du profil et des expériences.',
        'Demandez : « Comment LevelPilot encadre-t-il les actions des agents autonomes ? » Examinez les références et la distinction entre fonctionnalités et résultats mesurés.',
        'Demandez une information absente du corpus, par exemple un benchmark public de Personal RAG. Vérifiez que la réponse signale cette limite sans inventer de chiffres.',
      ],
    },
    'agents-ia-autonomes': {
      heading: 'Scénario de démonstration : Steal a tetris',
      paragraphs: [
        'Nous avons développé le jeu de démonstration « Steal a tetris » pour tester LevelPilot. Le parcours ci-dessous est un scénario fictif qui illustre le workflow visé : ce n’est pas une trace d’exécution enregistrée ni un résultat obtenu sur des joueurs réels.',
        'Dans cet exemple, l’agent cherche à rendre plus claire la première action du joueur. Le mode retenu autorise l’analyse et la préparation d’une PR ; la publication exige une validation humaine. Aucun gain de rétention n’est revendiqué.',
      ],
      bullets: [
        'Analyse : des événements de démonstration suggèrent un abandon avant la première prise de pièce. L’agent formule une hypothèse sur la clarté du tutoriel, sans conclure à une causalité.',
        'Préparation : les permissions du dépôt et le budget sont vérifiés. L’agent consulte le code Luau et prépare une modification limitée au message de guidage, dans un conteneur temporaire.',
        'Contrôle en échec : Selene signale une référence non définie. Le workflow reste à l’étape de validation et ne publie pas la modification.',
        'Reprise : l’agent corrige la référence et relance les contrôles configurés, dont StyLua, Selene et Rojo. Une PR résume les fichiers modifiés, l’hypothèse et les contrôles.',
        'Revue : une personne teste le parcours dans le jeu de démonstration avant d’autoriser la publication. Les métriques à observer sont définies avant toute comparaison.',
        'Retour arrière : si un problème apparaît après publication, le workflow de rollback prévu rétablit la version précédente selon les permissions et validations configurées.',
      ],
    },
  },
  en: {
    'personal-rag': {
      heading: 'Try this portfolio’s RAG assistant',
      paragraphs: [
        'The chat at the top of the homepage queries documentation about my profile and projects. Ask a question, then inspect the references displayed with the answer to review its sources.',
        'This demo uses the portfolio’s own backend. It offers a working RAG experience to inspect; it is neither a benchmark of the Python Personal RAG repository nor a guarantee of correct answers.',
      ],
      bullets: [
        'Ask: “What is your role at Thales and which stack do you use?” Compare the answer with the profile and experience documents.',
        'Ask: “How does LevelPilot control autonomous agents’ actions?” Inspect the references and the distinction between features and measured results.',
        'Ask for information missing from the corpus, such as a public Personal RAG benchmark. Check whether the answer acknowledges this limitation without inventing numbers.',
      ],
    },
    'agents-ia-autonomes': {
      heading: 'Demo scenario: Steal a tetris',
      paragraphs: [
        'We developed the demo game “Steal a tetris” to test LevelPilot. The walkthrough below is a fictional scenario illustrating the intended workflow, not a recorded execution or a result obtained from real players.',
        'In this example, the agent aims to clarify the player’s first action. The selected mode allows analysis and pull request preparation; publishing requires human approval. No retention improvement is claimed.',
      ],
      bullets: [
        'Analysis: demo events suggest players leave before taking their first piece. The agent proposes a hypothesis about tutorial clarity without claiming causality.',
        'Preparation: repository permissions and the budget are checked. The agent reads the Luau code and prepares a change limited to the guidance message in a temporary container.',
        'Failed check: Selene reports an undefined reference. The workflow stays at validation and does not publish the change.',
        'Recovery: the agent fixes the reference and reruns configured checks, including StyLua, Selene and Rojo. A pull request summarizes changed files, the hypothesis and checks.',
        'Review: a person tests the flow in the demo game before authorizing publication. Metrics to observe are defined before any comparison.',
        'Rollback: if a problem occurs after publication, the intended rollback workflow restores the previous version according to configured permissions and approvals.',
      ],
    },
  },
}
