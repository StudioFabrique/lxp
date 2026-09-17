import { whereFromObject } from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";

/**
 * Récupère tous les cours associés à un module spécifique
 * @param moduleId - L'identifiant du module dont on veut récupérer les cours
 * @returns Une promesse qui résout vers un tableau de cours
 */
export default async function getCoursesFromModule(moduleId: number) {
  // Recherche tous les cours qui ont le moduleId spécifié
  const courses = await prisma.orm.public.Course.where((row) =>
    whereFromObject(row, { moduleId }),
  )
    .select("id", "title")
    .include("tags", (related48) =>
      related48.include("tag", (related49) =>
        related49.select("id", "name", "color"),
      ),
    )
    .all();

  const serializedCourses = courses.map((item) => ({
    ...item,
    tags: item.tags.map((tag) => ({ ...tag.tag })),
  }));

  return serializedCourses;
}
