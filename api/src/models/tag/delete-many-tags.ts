import { prisma } from "../../utils/db.ts";
import deleteActivity from "../activity/delete-activity/delete-activity.ts";
import { assertCanDeleteTags, type TagActor } from "./tag-access.ts";

export default async function deleteManyTags(
  tagsIds: string[],
  actor: TagActor,
) {
  const numericTagIds = [...new Set(tagsIds.map((id) => parseInt(id, 10)))];
  const tags = await prisma.orm.public.Tag.where((row) =>
    row.id.in(numericTagIds),
  )
    .select("id", "createdBy")
    .all();

  if (tags.length !== numericTagIds.length) {
    throw { statusCode: 404, message: "Un ou plusieurs tags n'existent pas." };
  }
  assertCanDeleteTags(tags, actor);

  const activities = await prisma.orm.public.Activity.where((row) =>
    row.lesson.some((lesson) => lesson.tagId.in(numericTagIds)),
  )
    .select("id", "type")
    .all();
  for (const activity of activities) {
    await deleteActivity(activity.id, activity.type, "lesson");
  }

  await prisma.transaction(async (tx) => {
    await tx.orm.public.TagsOnCourse.where((row) =>
      row.tagId.in(numericTagIds),
    ).deleteAndCount();
    await tx.orm.public.TagsOnFormation.where((row) =>
      row.tagId.in(numericTagIds),
    ).deleteAndCount();
    await tx.orm.public.TagsOnParcours.where((row) =>
      row.tagId.in(numericTagIds),
    ).deleteAndCount();
    await tx.orm.public.TagsOnResources.where((row) =>
      row.tagId.in(numericTagIds),
    ).deleteAndCount();
    await tx.orm.public.Lesson.where((row) =>
      row.tagId.in(numericTagIds),
    ).deleteAndCount();
    await tx.orm.public.Tag.where((row) =>
      row.id.in(numericTagIds),
    ).deleteAndCount();
  });

  return [];
}
