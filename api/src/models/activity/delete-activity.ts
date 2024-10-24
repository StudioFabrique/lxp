import { prisma } from "../../utils/db";
import fs, { readdirSync } from "fs";
import path from "path";

export default async function deleteActivity(activId: number) {
  const existingActivity = await prisma.activity.findFirst({
    where: { id: activId },
  });

  if (!existingActivity) {
    const error: any = { message: "L'activité n'existe pas", statusCode: 404 };
    throw error;
  }

  if (existingActivity.type === "video") {
    try {
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
            existingActivity.url,
          ),
        );
      }
      await prisma.activity.delete({
        where: { id: existingActivity.id },
      });
      await reorderActivities(existingActivity.lessonId);
      return { message: "Activité supprimée." };
    } catch (error: any) {
      throw error;
    }
  }

  const filePath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "uploads",
    "activities",
    existingActivity.url,
  );

  //const fileContent = fs.readFileSync(filePath, "utf-8");

  try {
    await fs.promises.unlink(filePath);
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

// function extraireURLImages(texte: string): string[] {
//   const regex = /!\[\]\((.*?)\)/g;
//   const matches = texte.match(regex);
//   if (matches) {
//     return matches.map((match) => {
//       const urlRegex = /\(([^)]+)\)/;
//       const urlMatch = match.match(urlRegex);
//       return urlMatch ? urlMatch[1] : "";
//     });
//   }

//   return [];
// }

// function extraireNomImage(url: string): string | null {
//   const regex = /images\/(.*?)\./;
//   const match = url.match(regex);

//   return match ? match[1] : null;
// }

async function reorderActivities(lessonId: number) {
  const transaction = await prisma.$transaction(async (tx) => {
    let i = 1;
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
