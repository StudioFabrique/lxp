// Toutes les ressources
export const ressourcesRbac = [
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
  "profile",
];

// Ressources (toutes permissions) sur les différents rôles template
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
    "profile",
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
    "profile",
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
  ],
  // apprenant
  3: [],
  // autre
  4: [],
};
