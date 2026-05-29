import { Lesson } from "@prisma/client";
import { prisma } from "../../utils/db";

async function postCourseStructure(
  adminId: number,
  moduleId: number,
  title: string,
  description: string,
  lessons: Lesson[],
  courseSlug?: string,
) {
  const existingModule = await prisma.moduleMetadata.findFirst({
    where: { id: moduleId },
    select: { courses: true },
  });

  if (!existingModule) {
    const error = new Error("Le module n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  // Utilisation d'une transaction pour garantir l'intégrité
  const result = await prisma.$transaction(async (tx) => {
    // 1. Création du cours
    const newCourse = await tx.course.create({
      data: {
        title,
        description: description || "",
        courseSlug: courseSlug || "",
        order: existingModule.courses.length,
        author: "Import",
        adminId: adminId,
        moduleId,
        isPublished: false,
      },
    });

    // 2. Création des leçons
    const createdLessons = [];
    for (let i = 0; i < lessons.length; i++) {
      const lessonImport = lessons[i];

      const newLesson = await tx.lesson.create({
        data: {
          title: lessonImport.title,
          description: "",
          modalite: lessonImport.modalite || "hybride",
          author: "Import",
          adminId: adminId,
          courseId: newCourse.id,
          order: i,
          tagId: 1,
          isPublished: false,
        },
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
