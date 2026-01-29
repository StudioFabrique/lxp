import { Response } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { prisma } from "../../utils/db";

export default async function httpPostImportCourseStructure(
  req: CustomRequest,
  res: Response,
) {
  const userId = req.auth?.userId;
  const { title, description, lessons, parcoursId, moduleId } = req.body;

  try {
    const admin = await prisma.admin.findFirst({ where: { idMdb: userId } });
    if (!admin) return res.status(404).json({ message: "Admin introuvable" });

    // Utilisation d'une transaction pour garantir l'intégrité
    const result = await prisma.$transaction(async (tx) => {
      // 1. Création du cours
      const newCourse = await tx.course.create({
        data: {
          title,
          description: description || "",
          order: 99, // À gérer selon ta logique
          author: "Import",
          adminId: admin.id,
          moduleId: moduleId, // Lien avec le module
          isPublished: false,
        },
      });

      // Lien avec le parcours (Many-to-Many via metadatas ou relation directe selon schema)
      // Note: Ton schema Course a un `moduleId` obligatoire, donc le cours est lié au module.
      // Si tu dois lier au parcours, c'est via le moduleMetadata ou Tags.

      // 2. Création des leçons
      const createdLessons = [];
      // On utilise une boucle pour garder l'ordre et récupérer les IDs
      for (let i = 0; i < lessons.length; i++) {
        const lessonImport = lessons[i];

        // On ne crée que les leçons sélectionnées
        if (!lessonImport.isSelected) continue;

        const newLesson = await tx.lesson.create({
          data: {
            title: lessonImport.title,
            description: "",
            modalite: lessonImport.modalite || "hybride",
            author: "Import",
            adminId: admin.id,
            courseId: newCourse.id,
            tagId: 1, // ID par défaut ou à gérer
            order: i,
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

    return res.status(201).json(result);
  } catch (error: any) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur lors de l'import de la structure." });
  }
}
