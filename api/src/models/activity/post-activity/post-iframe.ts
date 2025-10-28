import { Activity, BonusActivity, Lesson, Resource } from "@prisma/client";
import { prisma } from "../../../utils/db";

import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export default async function postIframe(
  lessonId: number,
  userId: string,
  title: string,
  description: string,
  url: string
) {
  const existingLesson = await prisma.lesson.findFirst({
    where: { id: lessonId },
    select: { id: true, activities: true },
  });

  if (!existingLesson)
    throw { message: "L'id de la lesson n'existe pas", status: 404 };

  const existingAuthor = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (!existingAuthor) throw { message: "Utilisateur non trouvé", status: 404 };

  const createdActivity = await prisma.activity.create({
    data: {
      title,
      description,
      order: existingLesson.activities.length,
      type: "text",
      lesson: {
        connect: { id: existingLesson!.id },
      },
      url: fileName,
      author: {
        connect: {
          id: existingAuthor.id,
        },
      },
    },
  });

  return createdActivity;
}
