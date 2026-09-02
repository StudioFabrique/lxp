import { prisma } from "../../utils/db.ts";
import type { AccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

/**
 * Récupère la liste des leçons avec leurs informations associées.
 *
 * @param scope Périmètre de parcours/modules de l'appelant, ou `null` pour un
 * administrateur. Sans ce filtre, la route
 * retournait chaque leçon de la plateforme à n'importe quel apprenant.
 */
export default async function getLessonsList(
  scope: AccessScope = null,
) {
  // Récupération des leçons depuis la base de données avec une sélection précise des champs
  const existingLessons = await prisma.lesson.findMany({
    where:
      scope === null
        ? undefined
        : {
            course: {
              module:
                scope.moduleIds === null
                  ? { parcoursId: { in: scope.parcoursIds } }
                  : { id: { in: scope.moduleIds } },
            },
          },
    select: {
      id: true,
      title: true,
      modalite: true,
      tag: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
      createdAt: true,
      updatedAt: true,
      author: true,
      adminId: true,
      course: {
        select: {
          id: true,
          title: true,
          moduleId: true,
          module: {
            select: {
              parcours: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // Transformation des données pour simplifier la structure du parcours
  const lessons = existingLessons.map((lesson) => {
    return {
      ...lesson,
      course: {
        ...lesson.course,
        module: {
          id: lesson.course.moduleId,
          parcours: {
            // On prend le titre du premier parcours associé
            title: lesson.course.module.parcours.title,
          },
        },
      },
    };
  });

  return lessons;
}
