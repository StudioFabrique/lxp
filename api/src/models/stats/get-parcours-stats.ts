import { whereFromObject } from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";

/**
 * Récupérer les informations d'un parcours destiné à l'affichage pour l'étudiant.
 * - Diplome du parcours
 * - Nombre de semaines de cours du parcours
 * - Nombre d'heures de cours dans le parcours
 * - Nombre de modules dans le parcours
 */
export default async function getParcoursStats(parcoursId: number) {
  const parcours = await prisma.orm.public.Parcours.where((row) =>
    whereFromObject(row, { id: parcoursId }),
  )
    .include("formation", (related32) => related32.select("level"))
    .include("modules", (related33) =>
      related33
        .select("duration")
        .include("courses", (related34) =>
          related34.include("lessons", (related35) =>
            related35.select("modalite"),
          ),
        ),
    )
    .first();

  if (!parcours) return null;

  // Calculate total weeks
  const totalWeeks = Math.ceil(
    parcours.modules.reduce((acc, mod) => acc + (mod.duration || 0), 0) / 5,
  );

  // Calculate total hours
  const totalHours = parcours.modules.reduce(
    (acc, mod) => acc + (mod.duration || 0),
    0,
  );

  // Calculate number of modules
  const totalModules = parcours.modules.length;

  return {
    diplome: parcours.formation!.level,
    totalWeeks,
    totalHours,
    totalModules,
  };
}
