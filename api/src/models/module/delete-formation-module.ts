import { prisma } from "../../utils/db";
import userBelongsToContacts from "../../utils/userBelongsToContacts";
import deleteActivity from "../activity/delete-activity/delete-activity";

export default async function deleteFormationModule(
  userId: string,
  moduleId: number,
) {
  // Récupérer le module
  const existingModule = await prisma.module.findFirst({
    where: { id: moduleId },
    include: {
      metadatas: {
        include: {
          contacts: { select: { contact: { select: { idMdb: true } } } },
          courses: {
            include: {
              lessons: {
                include: { activities: true },
              },
            },
          },
        },
      },
    },
  });

  if (!existingModule) {
    const error = new Error("Le module n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  // Vérification des droits
  const contacts = existingModule.metadatas.flatMap((meta) =>
    meta.contacts.map((c) => c.contact),
  );

  await userBelongsToContacts(
    userId,
    contacts,
    "Vous n'êtes pas autorisé à supprimer ce module.",
  );

  // Collecte et suppression des activités
  const allActivities = existingModule.metadatas.flatMap((meta) =>
    meta.courses.flatMap((course) =>
      course.lessons.flatMap((lesson) => lesson.activities),
    ),
  );

  for (const act of allActivities) {
    await deleteActivity(act.id, act.type, "lesson");
  }

  // Suppression dans une transaction
  await prisma.$transaction(async (tx) => {
    // Suppression des relations et entités en cascade
    await tx.modulesOnFormation.deleteMany({ where: { moduleId } });
    await tx.quiz.deleteMany({ where: { moduleId } });

    await tx.moduleMetadata.deleteMany({ where: { moduleId } });
    await tx.module.delete({ where: { id: moduleId } });
  });

  return true;
}
