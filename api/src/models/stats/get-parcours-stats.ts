import { prisma } from "../../utils/db";

/**
 * Récupérer les informations d'un parcours destiné à l'affichage pour l'étudiant.
 * - Diplome du parcours
 * - Nombre de semaines de cours du parcours
 * - Nombre d'heures de cours dans le parcours
 * - Nombre de modules dans le parcours
 */
export default async function getParcoursStats(parcoursId: number) {
  const parcours = await prisma.parcours.findUnique({
    select: {
      formation: { select: { level: true } },
      modules: {
        select: {
          module: {
            select: {
              duration: true,
              courses: {
                select: {
                  lessons: {
                    select: {
                      modalite: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    where: { id: parcoursId },
  });

  if (!parcours) return null;

  // Calculate total weeks
  const totalWeeks = Math.ceil(
    parcours.modules.reduce((acc, mod) => acc + (mod.module.duration || 0), 0) /
      5,
  );

  // Calculate total hours
  const totalHours = parcours.modules.reduce(
    (acc, mod) => acc + (mod.module.duration || 0),
    0,
  );

  // Calculate number of modules
  const totalModules = parcours.modules.length;

  return {
    diplome: parcours.formation.level,
    totalWeeks,
    totalHours,
    totalModules,
  };
}
