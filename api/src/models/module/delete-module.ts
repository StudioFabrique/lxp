import {
  requireDatabaseRow,
  whereFromObject,
} from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";
import userBelongsToContacts from "../../utils/userBelongsToContacts.ts";
import deleteActivity from "../activity/delete-activity/delete-activity.ts";

export default async function deleteModule(moduleId: number, userId: string) {
  const module = await prisma.orm.public.Module.where((row) =>
    whereFromObject(row, { id: moduleId }),
  )
    .include("courses", (related143) =>
      related143.include("lessons", (related144) =>
        related144.include("activities"),
      ),
    )
    .include("parcours", (related145) =>
      related145.include("contacts", (related146) =>
        related146.include("contact"),
      ),
    )
    .first();

  if (!module) {
    throw { message: "Le module n'existe pas", statusCode: 404 };
  }

  await userBelongsToContacts(
    userId,
    module.parcours!.contacts.map(({ contact }) => contact),
    "Vous n'êtes pas autorisé à supprimer ce module.",
  );

  for (const activity of module.courses.flatMap((course) =>
    course.lessons.flatMap((lesson) => lesson.activities),
  )) {
    await deleteActivity(activity.id, activity.type, "lesson");
  }

  await prisma.orm.public.Module.where((row) =>
    whereFromObject(row, { id: moduleId }),
  )
    .delete()
    .then(requireDatabaseRow);
  return true;
}
