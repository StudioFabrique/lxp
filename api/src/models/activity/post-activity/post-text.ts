import type { Activity, BonusActivity } from "../../../prisma/model-types.ts";
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
  let existingLesson: any = null;
  let existingResource: any = null;

  if (parent === "lesson") {
    existingLesson = await prisma.orm.public.Lesson.where({ id: parentId })
      .select("id")
      .include("activities")
      .first();
  } else {
    existingResource = await prisma.orm.public.Resource.where({ id: parentId })
      .select("id")
      .include("bonusActivities")
      .first();
  }

  if (!existingLesson && !existingResource)
    throw { message: "Le parent de l'activité n'existe pas", status: 404 };

  const existingAuthor = await prisma.orm.public.Admin.where({
    idMdb: userId,
  }).first();

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
    createdActivity = await prisma.orm.public.Activity.create({
      title,
      order: existingLesson.activities.length,
      type: "text",
      lesson: (relation) => relation.connect({ id: existingLesson!.id }),
      url: fileName,
      author: (relation) =>
        relation.connect({
          id: existingAuthor.id,
        }),
    });
  else
    createdActivity = await prisma.orm.public.BonusActivity.create({
      title,
      order: existingResource.bonusActivities.length,
      type: "text",
      resource: (relation) => relation.connect({ id: existingResource!.id }),
      url: fileName,
      admin: (relation) =>
        relation.connect({
          id: existingAuthor.id,
        }),
    });

  return createdActivity;
}
