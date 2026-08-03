import { prisma } from "../../utils/db";
import deleteActivity from "../activity/delete-activity/delete-activity";

export default async function deleteTag(id: number) {
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

  await prisma.lesson.deleteMany({
    where: { tagId: id },
  });

  await prisma.tag.delete({
    where: { id },
  });
}
