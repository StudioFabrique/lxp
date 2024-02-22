// Toutes les ressources
export const ressourcesRbac = [
  "role",
  "permission",
  "default", // permission default permet de couvir l'ensemble des opération réalisables par un étudiant
  "tag",
  "user",
  "group",
  "formation",
  "parcours",
  "module",
  "course",
  "lesson",
  "bonusSkill",
];

// Ressources (toutes permissions crud) sur les différents rôles template
export const ressourcesRbacByRank = {
  // super administrateur ?
  0: [
    "role",
    "permission",
    "tag",
    "user",
    "group",
    "formation",
    "parcours",
    "module",
    "course",
    "lesson",
    "bonusSkill",
    "default",
  ],
  // administrateur
  1: [
    "role",
    "permission",
    "tag",
    "user",
    "group",
    "formation",
    "parcours",
    "module",
    "course",
    "lesson",
    "bonusSkill",
    "default",
  ],
  // formateur
  2: [
    "tag",
    "user",
    "group",
    "formation",
    "parcours",
    "module",
    "course",
    "bonusSkill",
    "lesson",
    "default",
  ],
  // apprenant
  3: ["default"],
  // autre
  4: [],
};
