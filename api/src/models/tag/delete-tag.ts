import { prisma } from "../../utils/db.ts";
import deleteActivity from "../activity/delete-activity/delete-activity.ts";
import { assertCanDeleteTags, type TagActor } from "./tag-access.ts";

export default async function deleteTag(id: number, actor: TagActor) {
  const tag = await prisma.tag.findUnique({
    where: { id },
    select: { createdBy: true },
  });

  if (!tag) {
    throw { statusCode: 404, message: "Le tag n'existe pas." };
  }
  assertCanDeleteTags([tag], actor);

  const activities = await prisma.activity.findMany({
    where: { lesson: { tagId: id } },
    select: { id: true, type: true },
  });

  for (const activity of activities) {
    await deleteActivity(activity.id, activity.type, "lesson");
  }

  await prisma.tagsOnFormation.deleteMany({
    where: { tagId: id },
  });

  await prisma.tagsOnParcours.deleteMany({
    where: { tagId: id },
  });

  await prisma.tagsOnCourse.deleteMany({
    where: { tagId: id },
  });

  await prisma.tagsOnResources.deleteMany({
    where: { tagId: id },
  });

  await prisma.lesson.deleteMany({
    where: { tagId: id },
  });

  await prisma.tag.delete({
    where: { id },
  });
}
