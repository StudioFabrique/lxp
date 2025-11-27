import { prisma } from "../../../utils/db";
//import path from "path";
//import fs from "fs";

/**
 * Met à jour une activité de type image
 * @param activityId - L'identifiant de l'activité à mettre à jour
 * @param userId - L'identifiant de l'utilisateur effectuant la mise à jour
 * @param title - Le nouveau titre de l'activité
 * @param description - La nouvelle description de l'activité
 * @param filename - Le nom du fichier image uploadé (optionnel)
 * @param url - L'URL de l'image depuis la médiathèque (optionnel)
 * @returns L'activité mise à jour
 * @throws {Error} Si l'utilisateur ou l'activité n'existe pas
 */
export default async function putActivityImage(
  activityId: number,
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

  // Vérifie que l'activité existe
  const existingActivity = await prisma.activity.findFirst({
    where: { id: activityId },
  });

  if (!existingActivity)
    throw { statusCode: 404, message: "L'activité n'existe pas." };

  //const oldFilename = existingActivity.url;

  // Met à jour l'activité avec les nouvelles données
  // Si un nouveau fichier est uploadé, utilise son nom
  // Sinon utilise l'URL de la médiathèque si fournie
  // Sinon conserve l'URL existante

  const transaction = await prisma.$transaction(async (tx) => {
    if (existingActivity.url) {
      const media = await tx.mediatheque.findFirst({
        where: { url: existingActivity.url },
      });
      if (media) {
        await tx.mediatheque.update({
          where: { id: media.id },
          data: { used: { decrement: 1 } },
        });
      }
    }

    await prisma.activity.update({
      where: { id: activityId },
      data: {
        title,
        url: filename ?? url ?? existingActivity.url,
      },
    });

    if (url) {
      const media = await tx.mediatheque.findFirst({
        where: { url },
      });
      if (media) {
        await tx.mediatheque.update({
          where: { id: media.id },
          data: { used: { increment: 1 } },
        });
      }
    }
  });

  return transaction;
}
