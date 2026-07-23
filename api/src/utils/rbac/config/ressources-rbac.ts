// Toutes les ressources de permissions
export const resourcesRbac = [
  {
    name: "activity",
    description: "Gestion des activités pédagogiques",
  },
  {
    name: "quiz",
    description: "Création et utilisation des évaluations",
  },
  {
    name: "chatbot",
    description: "Utilisation de l'assistant pédagogique",
  },
  {
    name: "dashboardIa",
    description: "Consultation des statistiques d'intelligence artificielle",
  },
  {
    name: "feedback",
    description: "Gestion des retours apprenants",
  },
  {
    name: "resource",
    description: "Gestion des ressources pédagogiques",
  },
  {
    name: "stats",
    description: "Consultation des statistiques",
  },
  {
    name: "role",
    description:
      "Gestion des rôles et niveaux d'accès pour une expérience personnalisée",
  },
  {
    name: "permission",
    description:
      "Configuration fine des droits d'accès pour une sécurité optimale",
  },
  {
    name: "tag",
    description:
      "Organisation intelligente et classification intuitive des contenus pédagogiques",
  },
  {
    name: "user",
    description:
      "Gestion avancée des profils apprenants et de leurs parcours individualisés",
  },
  {
    name: "group",
    description:
      "Création et animation de communautés d'apprentissage collaboratives",
  },
  {
    name: "formation",
    description:
      "Programmes complets de formation pour développer vos compétences",
  },
  {
    name: "parcours",
    description:
      "Itinéraires pédagogiques personnalisés pour un apprentissage optimal",
  },
  {
    name: "module",
    description:
      "Blocs d'apprentissage thématiques pour une progression structurée",
  },
  {
    name: "course",
    description: "Séquences pédagogiques interactives et engageantes",
  },
  {
    name: "lesson",
    description: "Contenus pédagogiques ciblés pour un apprentissage efficace",
  },
  {
    name: "bonusSkill",
    description:
      "Compétences complémentaires pour enrichir le parcours d'apprentissage",
  },
  {
    name: "objective",
    description:
      "Définition et suivi personnalisé des objectifs d'apprentissage",
  },
  {
    name: "mediatheque",
    description:
      "Centre de ressources multimédias pour approfondir vos connaissances",
  },
  // Ressource à retirer - sera remplacée par une meilleure implémentation du système de gestion de droits (role layout d'interface)
  {
    name: "cursus",
    description:
      "Espace personnel de suivi permettant de visualiser sa progression, gérer son profil et personnaliser son expérience d'apprentissage",
  },
  {
    name: "admin",
    description: "Permission temporaire - Afficher les admins",
  },
  {
    name: "student",
    description: "Permission temporaire - Afficher les étudiants",
  },
  {
    name: "teacher",
    description: "Permission temporaire - Afficher les formateurs",
  },
  {
    name: "everything",
    description:
      "Permission temporaire - Afficher tous les utilisateurs de tous roles confondus",
  },
];

// Permissions pour les rôles d'interface
export const layoutPermissionsList = ["admin", "teacher", "student"];

export const componentPermissionsList = [
  "hobbie",
  "social-network",
  "course",
  "group",
  "parcours",
  "profile",
  "user",
  "role",
  "course",
  "profile",
  "lesson",
  "module",
  "formation",
  "calendar",
  "mediatheque",
  "last-feedback",
  "lessons-rating-stats",
  "progression",
  "company-picture-upload",
  "start-lesson-button",
];

// Pour les actions write, update et delete pour teacher rank 2
// enlever certaines ressources du tableau
const teacherResourcesRbac = resourcesRbac.filter(
  (resource) =>
    !["permission", "role", "admin", "teacher", "everything"].includes(
      resource.name,
    ),
);

// Ressources (toutes permissions crud) sur les différents rôles template
export const resourcesRbacByRank = {
  // super administrateur ?
  0: {
    read: resourcesRbac.map((r) => r.name),
    write: resourcesRbac.map((r) => r.name),
    update: resourcesRbac.map((r) => r.name),
    delete: resourcesRbac.map((r) => r.name),
  },
  // administrateur
  1: {
    read: resourcesRbac.map((r) => r.name),
    write: resourcesRbac.map((r) => r.name),
    update: resourcesRbac.map((r) => r.name),
    delete: resourcesRbac.map((r) => r.name),
  },
  // formateur
  2: {
    read: resourcesRbac.map((r) => r.name),
    write: teacherResourcesRbac.map((r) => r.name),
    update: teacherResourcesRbac.map((r) => r.name),
    delete: teacherResourcesRbac.map((r) => r.name),
  },
  // apprenant
  3: {
    read: [
      "tag",
      "user",
      "group",
      "formation",
      "parcours",
      "module",
      "course",
      "bonusSkill",
      "lesson",
      "cursus",
      "quiz",
      "chatbot",
      "resource",
      "stats",
    ],
    write: ["cursus", "quiz", "chatbot", "feedback"],
    update: ["cursus"],
    delete: ["cursus"],
  },
  // autre
  4: [],
};

export async function getPermissionsByRank(
  rank: number,
): Promise<
  { resource: string; actions: ("read" | "write" | "update" | "delete")[] }[]
> {
  switch (rank) {
    case 1: {
      // const roles = await Role.find();
      // const roleNames = roles.map((role) => role.role);
      const resources: {
        resource: string;
        actions: ("read" | "write" | "update" | "delete")[];
      }[] = [];

      // Add regular resources
      resourcesRbacByRank[rank].read.forEach((resource) => {
        resources.push({
          resource,
          actions: ["read", "write", "update", "delete"],
        });
      });

      // Add role resources
      // roleNames.forEach((resource) => {
      //   resources.push({
      //     resource,
      //     actions: ["read", "write", "update", "delete"],
      //   });
      // });

      return resources;
    }
    case 2: {
      return resourcesRbacByRank[rank].read.map((resource) => ({
        resource,
        actions: resourcesRbacByRank[rank].write.includes(resource)
          ? ["read", "write", "update", "delete"]
          : ["read"],
      }));
    }
    case 3: {
      return resourcesRbacByRank[rank].read.map((resource) => ({
        resource,
        actions: resourcesRbacByRank[rank].write.includes(resource)
          ? ["read", "write", "update", "delete"]
          : ["read"],
      }));
    }
    case 4:
    default:
      return [];
  }
}
