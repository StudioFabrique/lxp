import { prisma } from "../../utils/db";
import fs, { readdirSync } from "fs";
import path from "path";

/**
 * Supprime une activité et ses ressources associées
 * @param activId - L'ID de l'activité à supprimer
 * @returns Un message de confirmation
 */
export default async function deleteActivity(activId: number) {
  // Récupère l'activité avec ses informations essentielles
  const existingActivity = await prisma.activity.findFirst({
    where: { id: activId },
    select: {
      id: true,
      resourceActivities: true,
      url: true,
      type: true,
      lessonId: true,
      order: true,
    },
  });

  // Vérifie si l'activité existe
  if (!existingActivity) {
    const error: any = { message: "L'activité n'existe pas", statusCode: 404 };
    throw error;
  }

  // Gestion spécifique des activités de type vidéo
  if (existingActivity.type === "video") {
    try {
      // Supprime le fichier vidéo local si ce n'est pas une URL externe
      if (!existingActivity.url.startsWith("https")) {
        await fs.promises.unlink(
          path.join(
            __dirname,
            "..",
            "..",
            "..",
            "uploads",
            "activities",
            "videos",
            existingActivity.url
          )
        );
      }
      // Supprime l'activité de la base de données
      await prisma.activity.delete({
        where: { id: existingActivity.id },
      });
      await reorderActivities(existingActivity.lessonId);
      return { message: "Activité supprimée." };
    } catch (error: any) {
      throw error;
    }
  }

  let filePath = "";

  // Détermine le chemin du fichier selon le type d'activité
  if (existingActivity.type === "image") {
    filePath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "uploads",
      "activities",
      "images",
      existingActivity.url
    );
  } else {
    filePath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "uploads",
      "activities",
      existingActivity.url
    );
  }

  // Gestion spécifique des activités de type ressource
  if (existingActivity.type === "resource") {
    filePath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "uploads",
      "activities",
      "files"
    );

    try {
      // Supprime tous les fichiers de ressources associés
      if (
        existingActivity.resourceActivities &&
        existingActivity.resourceActivities.length > 0
      ) {
        for (const file of existingActivity.resourceActivities) {
          const fullPath = path.join(filePath, file.url);
          console.log("Attempting to delete file:", fullPath);

          try {
            // Vérifie si le fichier existe avant de tenter de le supprimer
            await fs.promises.access(fullPath);
            await fs.promises.unlink(fullPath);
            console.log("Successfully deleted file:", fullPath);
          } catch (fileError: any) {
            console.log("Error deleting file:", fullPath, fileError.code);
            // Continue avec les autres fichiers même si un échoue
          }
        }
      }

      // Supprime l'activité de la base de données
      await prisma.activity.delete({
        where: { id: activId },
      });

      await reorderActivities(existingActivity.lessonId);
      return { message: "Activité supprimée." };
    } catch (error: any) {
      console.error("Delete activity error:", error);
      const deletionError: any = {
        message: `Les ressources associées à l'activité n'ont pas pu être effacées... (${error.message})`,
        statusCode: 500,
      };
      throw deletionError;
    }
  }

  // Lecture du contenu du fichier pour les autres types d'activités
  const fileContent = fs.readFileSync(filePath, "utf-8");

  // Extraction des URLs d'images du contenu
  const filesUrls = extraireURLImages(fileContent);
  let imageFiles = filesUrls.map((item: string) => extraireNomImage(item));

  try {
    // Supprime le fichier principal
    await fs.promises.unlink(filePath);
    const dirFiles = readdirSync(
      path.join(__dirname, "..", "..", "..", "uploads", "activities", "images")
    );
    console.log({ dirFiles });

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
        console.log(image);
        console.log(elem);

        if (image) {
          await fs.promises.unlink(
            path.join(
              __dirname,
              "..",
              "..",
              "..",
              "uploads",
              "activities",
              "images",
              image
            )
          );
        }
      }
    }
    // Supprime l'activité de la base de données
    await prisma.activity.delete({
      where: { id: activId },
    });
    await reorderActivities(existingActivity.lessonId);
  } catch (error: any) {
    const deletionError: any = {
      message: error.message,
      /* "Les ressources associées à l'activité n'ont pas pu être effacées..." */
    };
    throw deletionError;
  }

  return { message: "L'activité a été supprimée." };
}

/**
 * Extrait les URLs des images d'un texte markdown
 * @param texte - Le texte contenant potentiellement des images markdown
 * @returns Un tableau des URLs des images trouvées
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

/**
 * Réordonne les activités d'une leçon après une suppression
 * @param lessonId - L'ID de la leçon dont il faut réordonner les activités
 */
async function reorderActivities(lessonId: number) {
  const transaction = await prisma.$transaction(async (tx) => {
    let i = 0;
    const existingActivities = await tx.activity.findMany({
      where: { lessonId },
    });
    for (const activity of existingActivities) {
      await tx.activity.update({
        where: { id: activity.id },
        data: {
          ...activity,
          order: i,
        },
      });
      i += 1;
    }
  });
}
