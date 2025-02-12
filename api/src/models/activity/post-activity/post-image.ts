import { prisma } from "../../../utils/db";

/**
 * Crée une nouvelle activité de type image dans une leçon
 * @param lessonId - ID de la leçon parent
 * @param userId - ID MongoDB de l'utilisateur créateur
 * @param title - Titre de l'activité
 * @param description - Description de l'activité
 * @param filename - Nom du fichier uploadé (optionnel)
 * @param url - URL de l'image depuis la médiathèque (optionnel)
 * @returns La nouvelle activité créée
 */
export default async function postImage(
  lessonId: number,
  userId: string,
  title: string,
  description: string,
  filename: string | null,
  url: string | null
) {
  // Vérifie que l'utilisateur existe
  const existingUser = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });
  if (!existingUser)
    throw { statusCode: 404, message: "L'utilisateur n'existe pas." };

  // Vérifie que la leçon existe et récupère ses activités
  const existingLesson = await prisma.lesson.findFirst({
    where: { id: lessonId },
    select: { activities: true },
  });
  if (!existingLesson)
    throw { statusCode: 404, message: "La leçon n'existe pas" };

  // Vérifie qu'une source d'image est fournie (fichier ou URL)
  if (!filename && !url)
    throw {
      statusCode: 400,
      message: "Aucune source d'image n'a été fournie.",
    };

  const transaction = await prisma.$transaction(async (tx) => {
    // Crée la nouvelle activité

    const newActivity = await tx.activity.create({
      data: {
        title,
        description,
        lessonId,
        type: "image",
        url: filename ?? url ?? "", // Utilise le nom du fichier ou l'URL
        order: existingLesson.activities.length, // Place l'activité à la fin
        authorId: existingUser.id,
      },
    });
    if (url) {
      const media = await tx.mediatheque.findFirst({
        where: { url },
      });
      if (media) {
        await tx.mediatheque.update({
          where: { id: media.id, type: "image" },
          data: { used: { increment: 1 } },
        });
      }
    }
  });
  return;
}
