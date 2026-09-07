import { prisma } from "../../utils/db.ts";
import deleteActivity from "../activity/delete-activity/delete-activity.ts";
import { assertCanDeleteTags, type TagActor } from "./tag-access.ts";

export default async function deleteManyTags(
  tagsIds: string[],
  actor: TagActor,
) {
  const numericTagIds = [...new Set(tagsIds.map((id) => parseInt(id, 10)))];
  const tags = await prisma.tag.findMany({
    where: { id: { in: numericTagIds } },
    select: { id: true, createdBy: true },
  });

  if (tags.length !== numericTagIds.length) {
    throw { statusCode: 404, message: "Un ou plusieurs tags n'existent pas." };
  }
  assertCanDeleteTags(tags, actor);

  const activities = await prisma.activity.findMany({
    where: { lesson: { tagId: { in: numericTagIds } } },
    select: { id: true, type: true },
  });
  for (const activity of activities) {
    await deleteActivity(activity.id, activity.type, "lesson");
  }

  await prisma.$transaction([
    prisma.tagsOnCourse.deleteMany({
      where: { tagId: { in: numericTagIds } },
    }),
    prisma.tagsOnFormation.deleteMany({
      where: { tagId: { in: numericTagIds } },
    }),
    prisma.tagsOnParcours.deleteMany({
      where: { tagId: { in: numericTagIds } },
    }),
    prisma.tagsOnResources.deleteMany({
      where: { tagId: { in: numericTagIds } },
    }),
    prisma.lesson.deleteMany({
      where: { tagId: { in: numericTagIds } },
    }),
    prisma.tag.deleteMany({
      where: { id: { in: numericTagIds } },
    }),
  ]);

  return [];
}
