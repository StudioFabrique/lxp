import { prisma } from "../../utils/db";

/**
 * Récupère tous les cours associés à un module spécifique
 * @param moduleId - L'identifiant du module dont on veut récupérer les cours
 * @returns Une promesse qui résout vers un tableau de cours
 */
export default async function getCoursesFromModule(moduleId: number) {
  // Recherche tous les cours qui ont le moduleId spécifié
  const courses = await prisma.course.findMany({
    where: { moduleId },
    select: {
      id: true,
      title: true,
    },
  });

  return courses;
}
