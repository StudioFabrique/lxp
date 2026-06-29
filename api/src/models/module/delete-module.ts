import { prisma } from "../../utils/db";
import userBelongsToContacts from "../../utils/userBelongsToContacts";
import deleteCourse from "../course/delete-course-from-module";
import deleteActivity from "../activity/delete-activity/delete-activity";

async function deleteModuleMetadata(metadataId: number, userId: string) {
  // Récupération avec les relations nécessaires pour trouver les activités
  const existingMetadata = await prisma.moduleMetadata.findUnique({
    where: { id: metadataId },
    include: {
      courses: {
        include: {
          lessons: { include: { activities: true } },
        },
      },
      module: {
        include: { metadatas: { select: { id: true } } },
      },
      parcours: {
        include: { contacts: { include: { contact: true } } },
      },
    },
  });

  if (!existingMetadata) {
    const error = new Error("Le module metadata n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  // Vérification des droits
  await userBelongsToContacts(
    userId,
    existingMetadata.parcours.contacts.map((c) => c.contact),
    "Vous n'êtes pas autorisé à supprimer ce module.",
  );

  // Suppression des activités associées aux cours de cette metadata
  const allActivities = existingMetadata.courses.flatMap((course) =>
    course.lessons.flatMap((lesson) => lesson.activities),
  );

  for (const act of allActivities) {
    await deleteActivity(act.id, act.type, "lesson");
  }

  // Suppression dans une transaction globale
  await prisma.$transaction(async (tx) => {
    for (const course of existingMetadata.courses) {
      await deleteCourse(course.id, userId);
    }

    // Suppression des métadonnées
    await tx.moduleMetadata.delete({
      where: { id: metadataId },
    });

    // Si c'était la dernière métadonnée, suppression du module parent
    if (existingMetadata.module.metadatas.length <= 1) {
      await tx.module.delete({
        where: { id: existingMetadata.module.id },
      });
    }
  });

  return true;
}

export default deleteModuleMetadata;
