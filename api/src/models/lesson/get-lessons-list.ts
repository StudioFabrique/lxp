import { prisma } from "../../utils/db";

/**
 * Récupère la liste complète des leçons avec leurs informations associées
 * @returns Une liste de leçons avec leurs détails (titre, modalité, tag, cours, etc.)
 */
export default async function getLessonsList() {
  // Récupération des leçons depuis la base de données avec une sélection précise des champs
  const existingLessons = await prisma.lesson.findMany({
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
