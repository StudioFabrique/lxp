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
  "bonusSkill",
  "profile",
];

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
    "bonusSkill",
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
    "bonusSkill",
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
  ],
  // apprenant
  3: [],
  // autre
  4: [],
};
