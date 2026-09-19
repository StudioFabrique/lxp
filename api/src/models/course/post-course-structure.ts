import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import type { Lesson } from "../../prisma/model-types.ts";
import { prisma } from "../../utils/db.ts";
import { slugify } from "../../helpers/slugify.ts";

async function postCourseStructure(
  adminId: number,
  moduleId: number,
  title: string,
  description: string,
  lessons: Lesson[],
  courseSlug?: string,
) {
  const existingModule = await prisma.orm.public.Module.where({ id: moduleId })
    .include("courses")
    .first();

  if (!existingModule) {
    const error = new Error("Le module n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  // Utilisation d'une transaction pour garantir l'intégrité
  const result = await prisma.transaction(async (tx) => {
    // 1. Création du cours
    const providedSlug = (courseSlug || "").trim();
    const newCourse = await tx.orm.public.Course.create({
      title,
      description: description || "",
      courseSlug: providedSlug,
      order: existingModule.courses.length,
      dates: [],
      author: "Import",
      adminId: adminId,
      moduleId,
      isPublished: false,
    });

    if (!providedSlug) {
      const generated = `${slugify(title) || "cours"}-${newCourse.id}`;
      await tx.orm.public.Course.where({ id: newCourse.id })
        .update({ courseSlug: generated })
        .then(requireDatabaseRow);
      newCourse.courseSlug = generated;
    }

    // 2. Création des leçons
    const createdLessons = [];
    for (let i = 0; i < lessons.length; i++) {
      const lessonImport = lessons[i];

      const newLesson = await tx.orm.public.Lesson.create({
        title: lessonImport.title,
        description: "",
        modalite: lessonImport.modalite || "hybride",
        author: "Import",
        adminId: adminId,
        courseId: newCourse.id,
        order: i,
        tagId: 1,
        visibility: true,
      });

      createdLessons.push({
        tempId: lessonImport.id, // L'ID aléatoire du front
        realId: newLesson.id, // Le vrai ID Postgres
      });
    }

    return { course: newCourse, lessonsMap: createdLessons };
  });

  return result;
}

export default postCourseStructure;
