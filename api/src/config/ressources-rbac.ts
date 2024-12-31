// Toutes les ressources
export const resourcesRbac = [
  { name: "role", description: "Rôles et permissions des utilisateurs" },
  { name: "permission", description: "Paramètres des permissions" },
  { name: "tag", description: "Tags et catégories de contenu" },
  { name: "user", description: "Comptes et profils utilisateurs" },
  { name: "group", description: "Groupes et équipes d'utilisateurs" },
  { name: "formation", description: "Formations" },
  { name: "parcours", description: "Parcours pédagogiques" },
  { name: "module", description: "Modules de cours" },
  { name: "course", description: "Cours individuels" },
  { name: "lesson", description: "Leçons de cours" },
  {
    name: "bonusSkill",
    description: "Compétences et aptitudes additionnelles",
  },
  { name: "objective", description: "Objectifs d'apprentissage" },
  { name: "mediatheque", description: "Ressources de la médiathèque" },
];

// Pour les actions write, update et delete pour teacher rank 2
// enlever certaines ressources du tableau
const teacherResourcesRbac = resourcesRbac.filter(
  (resource) => !["user", "permission"].includes(resource.name),
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
    read: [],
    write: [],
    update: [],
    delete: [],
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
