import type {
  Lesson,
  Resource,
  Activity,
  BonusActivity,
} from "../../../prisma/model-types.ts";
import { prisma } from "../../../utils/db.ts";

export default async function postIframe(
  lessonId: number,
  userId: string,
  title: string,
  description: string,
  url: string,
  parent: "lesson" | "resource" = "lesson",
) {
  let existingParent: Lesson | Resource | null = null;

  if (parent === "lesson")
    existingParent = await prisma.orm.public.Lesson.where({ id: lessonId })
      .include("activities")
      .first();
  else if (parent === "resource")
    existingParent = await prisma.orm.public.Resource.where({ id: lessonId })
      .include("bonusActivities")
      .first();

  if (!existingParent)
    throw { message: "L'id de la lesson n'existe pas", status: 404 };

  const existingAuthor = await prisma.orm.public.Admin.where({
    idMdb: userId,
  }).first();

  if (!existingAuthor) throw { message: "Utilisateur non trouvé", status: 404 };

  let createdActivity: Activity | BonusActivity | null;

  if (parent === "lesson") {
    createdActivity = await prisma.orm.public.Activity.create({
      title,
      order: (existingParent as Lesson & { activities: Activity[] }).activities
        .length,
      type: "iframe",
      lesson: (relation) => relation.connect({ id: existingParent.id }),
      url,
      author: (relation) =>
        relation.connect({
          id: existingAuthor.id,
        }),
    });
    return createdActivity;
  } else if (parent === "resource") {
    createdActivity = await prisma.orm.public.BonusActivity.create({
      title,
      order: (existingParent as Resource & { bonusActivities: BonusActivity[] })
        .bonusActivities.length,
      type: "iframe",
      resource: (relation) => relation.connect({ id: existingParent.id }),
      url,
      admin: (relation) =>
        relation.connect({
          id: existingAuthor.id,
        }),
    });
    return createdActivity;
  } else return;
}
