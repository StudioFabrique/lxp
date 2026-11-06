import { prisma } from "../../utils/db.ts";

/**
 * Récupérer les informations d'un parcours destiné à l'affichage pour l'étudiant.
 * - Diplome du parcours
 * - Nombre de semaines entre le début et la fin du parcours
 * - Nombre d'heures de cours dans le parcours
 * - Nombre de modules dans le parcours
 */
export default async function getParcoursStats(parcoursId: number) {
  const parcours = await prisma.orm.public.Parcours.where({ id: parcoursId })
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

  // Durée calendaire du parcours, calculée comme dans l'aperçu du parcours côté
  // frontend (`quick-statistiques`) pour que les deux écrans affichent le même nombre.
  const MILLIS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
  const totalWeeks =
    parcours.startDate && parcours.endDate
      ? Math.max(
          0,
          Math.floor(
            (new Date(parcours.endDate).getTime() -
              new Date(parcours.startDate).getTime()) /
              MILLIS_PER_WEEK,
          ),
        )
      : 0;

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
