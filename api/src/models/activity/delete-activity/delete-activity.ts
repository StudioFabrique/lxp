import fs, { readdirSync } from "fs";
import path from "path";

import { prisma } from "../../../utils/db";

export default async function deleteActivity(
  activityId: number,
  type: string,
  parent = "lesson",
) {
  const existingActivity = await (parent === "lesson"
    ? prisma.activity.findFirst({
        where: { id: activityId },
        include: { resourceActivities: true },
      })
    : prisma.bonusActivity.findFirst({
        where: { id: activityId },
        include: { resourceBonusActivities: true },
      }));

  if (!existingActivity) {
    throw { statusCode: 404, message: "L'activité n'existe pas" };
  }

  const activityFolder = path.resolve(
    __dirname,
    "../../../../uploads/activities",
  );
  const filePath = path.join(activityFolder, existingActivity.url);

  await prisma.$transaction(async (tx: any) => {
    // Delete Activity
    if (parent === "lesson") {
      await tx.activity.delete({ where: { id: activityId } });
    } else {
      await tx.bonusActivity.delete({ where: { id: activityId } });
    }

    if (type === "resource") {
      const resources =
        (existingActivity as any).resourceActivities ||
        (existingActivity as any).resourceBonusActivities ||
        [];
      await updateMediatheque(resources, tx);
    } else if (type === "text") {
      console.log({ filePath });
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const names = extraireURLImages(fileContent)
          .map(extraireNomImage)
          .filter(Boolean);

        // Convert names to objects matching the helper's expected shape
        const resources = names.map((name) => ({ url: name! }));
        console.log({ resources });
        await updateMediatheque(resources, tx);
      }
    } else if (!(type === "video" && existingActivity.url.startsWith("http"))) {
      await updateMediatheque([{ url: existingActivity.url }], tx);
    }
  });

  // File System Cleanup
  if (
    type === "text" ||
    (type === "video" && !existingActivity.url.startsWith("http"))
  ) {
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (error) {
      console.error("FS Error:", error);
    }
  }
}

/**
 * Gestion des images qui se trouvent dans l'activité de type texte
 * @param texte
 * @returns
 */
function extraireURLImages(texte: string): string[] {
  // Regex matches <img src="URL"> and captures the URL inside the quotes
  const regex = /<img[^>]+src="([^">]+)"/g;
  const matches = [];
  let match;

  while ((match = regex.exec(texte)) !== null) {
    matches.push(match[1]); // match[1] is the captured URL
  }

  console.log({ extractedUrls: matches });
  return matches;
}

/**
 * Extrait le nom de l'image à partir de son URL
 * @param url - L'URL de l'image
 * @returns Le nom de l'image ou null si non trouvé
 */
function extraireNomImage(url: string): string | null {
  // This extracts the image file name after the last '/'
  const parts = url.split("/");
  console.log({ parts });
  return parts.length > 0 ? parts[parts.length - 1] : null;
}

async function updateMediatheque(
  resources: { url: string }[],
  tx: TransactionClient,
) {
  for (const res of resources) {
    if (!res.url) continue;

    await tx.mediatheque.updateMany({
      where: { url: res.url },
      data: { used: { decrement: 1 } },
    });
  }
}
