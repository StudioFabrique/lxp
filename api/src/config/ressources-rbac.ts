// Toutes les ressources
export const ressourcesRbac = [
  "role",
  "permission",
  "basic", // permission basic permet de couvir l'ensemble des opération réalisables par un étudiant
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
    "basic",
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
    "basic",
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
    "basic",
  ],
  // apprenant
  3: ["basic"],
  // autre
  4: [],
};
