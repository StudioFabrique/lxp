export type ReleaseNote = {
  version: string;
  status: string;
  summary: string;
  changes: { title: string; description: string }[];
};

// Résumés destinés aux utilisateurs, rédigés à partir des changements livrés.
// Ajouter la prochaine version en tête de liste.
export const releaseNotes: ReleaseNote[] = [
  {
    version: "0.9",
    status: "Beta",
    summary: "Une version bêta plus simple à configurer et à utiliser.",
    changes: [
      {
        title: "Démarrage simplifié",
        description: "Création du premier compte et configuration de l’instance plus claires.",
      },
      {
        title: "Parcours apprenant",
        description: "Profil d’apprentissage par module et progression plus faciles à suivre.",
      },
      {
        title: "Personnalisation",
        description: "Nouvelles couleurs pour le calendrier et interface harmonisée.",
      },
      {
        title: "Fiabilité",
        description: "États de chargement, listes vides et messages d’erreur plus lisibles.",
      },
    ],
  },
];

export const currentRelease = releaseNotes[0];
