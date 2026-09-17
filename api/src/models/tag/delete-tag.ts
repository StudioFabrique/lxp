import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import { prisma } from "../../utils/db.ts";
import deleteActivity from "../activity/delete-activity/delete-activity.ts";
import { assertCanDeleteTags, type TagActor } from "./tag-access.ts";

export default async function deleteTag(id: number, actor: TagActor) {
  const tag = await prisma.orm.public.Tag.where({ id })
    .select("createdBy")
    .first();

  if (!tag) {
    throw { statusCode: 404, message: "Le tag n'existe pas." };
  }
  assertCanDeleteTags([tag], actor);

  const activities = await prisma.orm.public.Activity.where((row) =>
    row.lesson.some((lesson) => lesson.tagId.eq(id)),
  )
    .select("id", "type")
    .all();

  for (const activity of activities) {
    await deleteActivity(activity.id, activity.type, "lesson");
  }

  await prisma.orm.public.TagsOnFormation.where({ tagId: id })
    .deleteAndCount()
    .then((count) => ({ count }));

  await prisma.orm.public.TagsOnParcours.where({ tagId: id })
    .deleteAndCount()
    .then((count) => ({ count }));

  await prisma.orm.public.TagsOnCourse.where({ tagId: id })
    .deleteAndCount()
    .then((count) => ({ count }));

  await prisma.orm.public.TagsOnResources.where({ tagId: id })
    .deleteAndCount()
    .then((count) => ({ count }));

  await prisma.orm.public.Lesson.where({ tagId: id })
    .deleteAndCount()
    .then((count) => ({ count }));

  await prisma.orm.public.Tag.where({ id }).delete().then(requireDatabaseRow);
}
