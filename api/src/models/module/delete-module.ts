import { prisma } from "../../utils/db.ts";
import userBelongsToContacts from "../../utils/userBelongsToContacts.ts";
import deleteActivity from "../activity/delete-activity/delete-activity.ts";

export default async function deleteModule(moduleId: number, userId: string) {
  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    include: {
      courses: {
        include: { lessons: { include: { activities: true } } },
      },
      parcours: {
        include: { contacts: { include: { contact: true } } },
      },
    },
  });

  if (!module) {
    throw { message: "Le module n'existe pas", statusCode: 404 };
  }

  await userBelongsToContacts(
    userId,
    module.parcours.contacts.map(({ contact }) => contact),
    "Vous n'êtes pas autorisé à supprimer ce module.",
  );

  for (const activity of module.courses.flatMap((course) =>
    course.lessons.flatMap((lesson) => lesson.activities),
  )) {
    await deleteActivity(activity.id, activity.type, "lesson");
  }

  await prisma.module.delete({ where: { id: moduleId } });
  return true;
}
