import Role from "../utils/interfaces/db/role";

// Toutes les ressources
export const resourcesRbac = [
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
  "objective",
  "mediatheque",
];

// Pour les actions write, update et delete pour teacher rank 2
// enlever certaines ressources du tableau
const teacherResourcesRbac = resourcesRbac.filter(
  (resource) => !["user", "permission"].includes(resource),
);

// Ressources (toutes permissions crud) sur les différents rôles template
export const resourcesRbacByRank = {
  // super administrateur ?
  0: {
    read: [...resourcesRbac],
    write: [...resourcesRbac],
    update: [...resourcesRbac],
    delete: [...resourcesRbac],
  },
  // administrateur
  1: {
    read: [...resourcesRbac],
    write: [...resourcesRbac],
    update: [...resourcesRbac],
    delete: [...resourcesRbac],
  },
  // formateur
  2: {
    read: [...resourcesRbac],
    write: [...teacherResourcesRbac],
    update: [...teacherResourcesRbac],
    delete: [...teacherResourcesRbac],
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
