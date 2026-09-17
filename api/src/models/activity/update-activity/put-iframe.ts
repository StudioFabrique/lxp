import { requireDatabaseRow } from "../../../utils/require-database-row.ts";
import type { Activity, BonusActivity } from "../../../prisma/model-types.ts";
import { prisma } from "../../../utils/db.ts";

export default async function putIframe(
  activityId: number,
  userId: string,
  title: string,
  description: string,
  url: string,
  parent: "lesson" | "resource",
) {
  const existingAuthor = await prisma.orm.public.Admin.where({
    idMdb: userId,
  }).first();

  if (!existingAuthor) throw { message: "Utilisateur non trouvé", status: 404 };

  let existingContent: Activity | BonusActivity | null = null;

  if (parent === "lesson") {
    existingContent = await prisma.orm.public.Activity.where({
      id: activityId,
    }).first();
  } else if (parent === "resource") {
    existingContent = await prisma.orm.public.BonusActivity.where({
      id: activityId,
    }).first();
  }

  if (!existingContent) throw { message: "Contenu non trouvé", status: 404 };

  let updatedActivity: Activity | BonusActivity | null = null;

  if (parent === "lesson") {
    updatedActivity = await prisma.orm.public.Activity.where({ id: activityId })
      .update({
        title,
        type: "iframe",
        url,
        author: (relation) =>
          relation.connect({
            id: existingAuthor.id,
          }),
      })
      .then(requireDatabaseRow);
  } else if (parent === "resource") {
    updatedActivity = await prisma.orm.public.BonusActivity.where({
      id: activityId,
    })
      .update({
        title,
        type: "iframe",
        url,
        admin: (relation) =>
          relation.connect({
            id: existingAuthor.id,
          }),
      })
      .then(requireDatabaseRow);
  }

  return updatedActivity;
}
