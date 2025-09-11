import fs, { readdirSync } from "fs";
import path from "path";

import { prisma } from "../../../utils/db";
import {
  Activity,
  BonusActivity,
  ResourceActivity,
  ResourceBonusActivity,
} from "@prisma/client";

export default async function deleteActivity(
  activityId: number,
  type: string,
  parent = "lesson"
) {
  let existingActivity: Activity | BonusActivity | null = null;

  if (parent === "lesson")
    existingActivity = await prisma.activity.findFirst({
      where: { id: activityId },
      include: {
        resourceActivities: true,
      },
    });
  else
    existingActivity = await prisma.bonusActivity.findFirst({
      where: { id: activityId },
      include: {
        resourceBonusActivities: true,
      },
    });

  if (!existingActivity)
    throw { statusCode: 404, message: "L'activité n'existe pas" };

  await prisma.$transaction(async (tx) => {

    parent === "lesson"
      ? await tx.activity.delete({ where: { id: activityId } })
      : await tx.bonusActivity.delete({ where: { id: activityId } });

    const activityToDelete = await tx.activity.findUnique({
      where: { id: activityId },
    });

    if (!activityToDelete) {
      console.log(`Activity ${activityId} already deleted, skipping...`);
      return;
    }

    await tx.activity.delete({
      where: { id: activityId },
    });

    // Gestion des activités de type vidéo (fichier viédo ou lien externe)
    if (type === "video" && existingActivity.url.startsWith("https://")) return;

    // Gestion des activités de type texte (fichier markdown)
    if (type === "text") {
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "uploads",
        "activities",
        existingActivity.url
      );

      // Lecture du contenu du fichier pour les autres types d'activités
      const fileContent = fs.readFileSync(filePath, "utf-8");

      // Extraction des URLs d'images du contenu
      const filesUrls = extraireURLImages(fileContent);
      let imageFiles = filesUrls.map((item: string) => extraireNomImage(item));

      try {
        const dirFiles = readdirSync(
          path.join(
            __dirname,
            "..",
            "..",
            "..",
            "..",
            "uploads",
            "activities",
            "images"
          )
        );

        // Supprime les images associées si elles existent
        if (imageFiles.length > 0) {
          for (const elem of imageFiles) {
            const imagePath = path.join(
              __dirname,
              "..",
              "..",
              "..",
              "uploads",
              "activities",
              "images",
              elem!
            );
            const image = dirFiles.find((item) => item.includes(elem!));
            if (image) {
              await tx.mediatheque.updateMany({
                where: { url: image },
                data: {
                  used: {
                    decrement: 1,
                  },
                },
              });
            }
          }
        }

        await fs.promises.unlink(filePath);
        return;
      } catch (error) {
        console.log({ error });

        throw {
          statusCode: 500,
          message: "Erreur lors de la suppression du fichier",
        };
      }
    }

    if (type === "resource") {
      if (parent === "lesson") {
        await updateMediatheque(
          (
            existingActivity as Activity & {
              resourceActivities: ResourceActivity[];
            }
          ).resourceActivities
        );
      } else {
        await updateMediatheque(
          (
            existingActivity as BonusActivity & {
              resourceBonusActivities: ResourceBonusActivity[];
            }
          ).resourceBonusActivities
        );
      }
      return;
    }

    // Mise à jour de la médiathèque (décrémentation du compteur d'utilisation)
    await tx.mediatheque.updateMany({
      where: { url: existingActivity.url },
      data: {
        used: {
          decrement: 1,
        },
      },
    });

    return;
  });
}

/**
 * Gestion des images qui se trouvent dans l'activité de type texte
 * @param texte
 * @returns
 */
function extraireURLImages(texte: string): string[] {
  const regex = /!\[\]\((.*?)\)/g;
  const matches = texte.match(regex);
  if (matches) {
    return matches.map((match) => {
      const urlRegex = /\(([^)]+)\)/;
      const urlMatch = match.match(urlRegex);
      return urlMatch ? urlMatch[1] : "";
    });
  }
  return [];
}

/**
 * Extrait le nom de l'image à partir de son URL
 * @param url - L'URL de l'image
 * @returns Le nom de l'image ou null si non trouvé
 */
function extraireNomImage(url: string): string | null {
  const regex = /images\/(.*?)\./;
  const match = url.match(regex);
  return match ? match[1] : null;
}

async function updateMediatheque(
  resource: ResourceActivity[] | ResourceBonusActivity[]
) {
  for (const res of resource) {
    await prisma.mediatheque.updateMany({
      where: { url: res.url },
      data: {
        used: {
          decrement: 1,
        },
      },
    });
  }
}
