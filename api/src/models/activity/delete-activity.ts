import { prisma } from "../../utils/db";
import fs, { readdirSync } from "fs";
import path from "path";

export default async function deleteActivity(activId: number) {
  const existingActivity = await prisma.activity.findFirst({
    where: { id: activId },
  });

  if (!existingActivity) {
    const error: any = { message: "L'acitivité n'existe pas", statusCode: 404 };
    throw error;
  }

  const filePath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "uploads",
    "activities",
    existingActivity.url
  );

  const fileContent = fs.readFileSync(filePath, "utf-8");

  const filesUrls = extraireURLImages(fileContent);
  let imageFiles = filesUrls.map((item: string) => extraireNomImage(item));

  try {
    await fs.promises.unlink(filePath);
    const dirFiles = readdirSync(
      path.join(__dirname, "..", "..", "..", "uploads", "activities", "images")
    );
    console.log({ dirFiles });

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
    await prisma.activity.delete({
      where: { id: activId },
    });
  } catch (error: any) {
    const deletionError: any = {
      message: error.message,
      /* "Les ressources associées à l'activité n'ont pas pu être effacées..." */
    };
    throw deletionError;
  }

  return { message: "L'activité a été supprimée." };
}

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

function extraireNomImage(url: string): string | null {
  const regex = /images\/(.*?)\./;
  const match = url.match(regex);

  return match ? match[1] : null;
}
