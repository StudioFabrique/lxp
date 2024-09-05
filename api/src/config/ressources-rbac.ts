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

// Pour les actions write, update et delete pour teacher rank 2
// enlever certaines ressources du tableau
const teacherRbacRessources = ressourcesRbac.filter(
  (ressource) => !ressource.includes("user"),
);

// Ressources (toutes permissions crud) sur les différents rôles template
export const ressourcesRbacByRank = {
  // super administrateur ?
  0: {
    read: [...ressourcesRbac],
    write: [...ressourcesRbac],
    update: [...ressourcesRbac],
    delete: [...ressourcesRbac],
  },
  // administrateur
  1: {
    read: [...ressourcesRbac],
    write: [...ressourcesRbac],
    update: [...ressourcesRbac],
    delete: [...ressourcesRbac],
  },
  // formateur
  2: {
    read: [...ressourcesRbac],
    write: [...teacherRbacRessources],
    update: [...teacherRbacRessources],
    delete: [...teacherRbacRessources],
  },
  // apprenant
  3: {
    read: "default",
    write: [],
    update: [],
    delete: [],
  },
  // autre
  4: [],
};
