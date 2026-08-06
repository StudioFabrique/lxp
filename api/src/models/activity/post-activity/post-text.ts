import { type Activity, type BonusActivity } from "@prisma/client";
import { prisma } from "../../../utils/db.ts";

import fs from "fs";
import path from "path";
import { randomUUID } from "node:crypto";

export default async function postActivityText(
  parentId: number,
  userId: string,
  title: string,
  description: string,
  value: string,
  parent: "lesson" | "resource",
) {
  console.log({ parent });

  let existingLesson: any = null;
  let existingResource: any = null;

  if (parent === "lesson") {
    existingLesson = await prisma.lesson.findFirst({
      where: { id: parentId },
      select: { id: true, activities: true },
    });
  } else {
    existingResource = await prisma.resource.findFirst({
      where: { id: parentId },
      select: { id: true, bonusActivities: true },
    });
  }

  if (!existingLesson && !existingResource)
    throw { message: "Le parent de l'activité n'existe pas", status: 404 };

  const existingAuthor = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (!existingAuthor) throw { message: "Utilisateur non trouvé", status: 404 };

  const uniqueID: string = randomUUID();
  const fileName: string = uniqueID + new Date().getTime() + ".html";

  try {
    const file = fs.writeFileSync(
      path.join(
        import.meta.dirname,
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
    throw {
      message:
        "Le fichier n'a pas pu être enregistré, réessayez plus tard svp...",
      statusCode: 500,
    };
  }

  let createdActivity: Activity | BonusActivity | null = null;

  if (parent === "lesson")
    createdActivity = await prisma.activity.create({
      data: {
        title,
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
  else
    createdActivity = await prisma.bonusActivity.create({
      data: {
        title,
        order: existingResource.bonusActivities.length,
        type: "text",
        resource: {
          connect: { id: existingResource!.id },
        },
        url: fileName,
        admin: {
          connect: {
            id: existingAuthor.id,
          },
        },
      },
    });

  return createdActivity;
}
