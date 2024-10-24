import { prisma } from "../../../utils/db";

import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export default async function postText(
  lessonId: number,
  userId: string,
  title: string,
  description: string,
  value: string,
  type: string,
) {
  const existingLesson = await prisma.lesson.findFirst({
    where: { id: lessonId },
    select: { id: true, activities: true },
  });

  if (!existingLesson) {
    const error = new Error("La leçon n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const existingAuthor = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (!existingAuthor) {
    const error = new Error("L'utilisateur n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const uniqueID: string = uuidv4();
  const fileName: string = uniqueID + new Date().getTime() + ".mdx";

  try {
    const file = fs.writeFileSync(
      path.join(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "uploads",
        "activities",
        fileName,
      ),
      value,
    );
  } catch (error: any) {
    throw new Error(
      "Le fichier n'a pas pu être enregistré, réessayez plus tard svp...",
    );
  }

  const createdActivity = await prisma.activity.create({
    data: {
      title,
      description,
      url: fileName,
      order: existingLesson.activities.length,
      type,
      lesson: {
        connect: {
          id: lessonId,
        },
      },
      author: {
        connect: {
          id: existingAuthor.id,
        },
      },
    },
  });

  return createdActivity;
}
