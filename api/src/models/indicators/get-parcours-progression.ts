import {
  calculateModuleProgress,
  countCourseProgress,
  toProgressPercentage,
} from "../../helpers/calculate-module-progress.ts";
import { prisma } from "../../utils/db.ts";
import User from "../../utils/interfaces/db/user.ts";
import { emptyIndicator, type Indicator, type IndicatorContext } from "./types.ts";

export const PARCOURS_PROGRESSION_KEY = "parcours_progression";

type ModuleProgress = {
  id: number;
  title: string;
  progress: number;
};

/**
 * Avancement dans le parcours, en pourcentage de leçons terminées.
 *
 * Réutilise `calculateModuleProgress`, seul calcul de progression faisant
 * autorité côté serveur. Le front en portait quatre variantes divergentes et
 * appelait par ailleurs une route `/modules/progression/:id` inexistante, si
 * bien que la vue administrateur affichait un immuable 0 %.
 */
export default async function getParcoursProgression(
  context: IndicatorContext,
): Promise<Indicator<number>> {
  const label = "Progression dans le parcours";

  const user = await User.findById(context.userIdMdb).select("group").lean();
  const groupIdMdb = (user?.group as unknown as Array<unknown> | undefined)?.[0]
    ?.toString();

  if (!groupIdMdb) {
    return emptyIndicator(PARCOURS_PROGRESSION_KEY, label, "percent", {
      reason: "Cet apprenant n'appartient à aucun groupe.",
    });
  }

  const group = await prisma.group.findFirst({
    where: { idMdb: groupIdMdb },
    select: {
      parcours: {
        orderBy: { parcoursId: "desc" },
        take: 1,
        select: { parcoursId: true },
      },
    },
  });

  const parcoursId = group?.parcours[0]?.parcoursId;

  if (!parcoursId) {
    return emptyIndicator(PARCOURS_PROGRESSION_KEY, label, "percent", {
      reason: "Aucun parcours rattaché au groupe de cet apprenant.",
    });
  }

  const modules = await prisma.module.findMany({
    where: { parcoursId },
    select: {
      id: true,
      title: true,
      courses: {
        orderBy: { order: "asc" },
        select: {
          lessons: {
            orderBy: { order: "asc" },
            select: {
              lessonsRead: {
                where: { student: { idMdb: context.userIdMdb } },
                select: { id: true, finishedAt: true },
              },
            },
          },
        },
      },
    },
  });

  if (modules.length === 0) {
    return emptyIndicator(PARCOURS_PROGRESSION_KEY, label, "percent", {
      reason: "Ce parcours ne contient aucun module.",
      parcoursId,
    });
  }

  const perModule: ModuleProgress[] = modules.map((module) => ({
    id: module.id,
    title: module.title,
    progress: calculateModuleProgress(module),
  }));

  // Pondéré par leçon sur l'ensemble du parcours, comme partout ailleurs :
  // moyenner les pourcentages des modules donnerait un chiffre différent de
  // celui qu'affiche la sidebar de l'apprenant.
  const overall = toProgressPercentage(
    countCourseProgress(modules.flatMap((module) => module.courses)),
  );

  return {
    key: PARCOURS_PROGRESSION_KEY,
    label,
    value: overall,
    unit: "percent",
    available: true,
    meta: { parcoursId, modules: perModule },
  };
}
