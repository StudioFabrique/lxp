import {
  requireDatabaseRow,
  whereFromObject,
} from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";
import userBelongsToContacts from "../../utils/userBelongsToContacts.ts";
import deleteActivity from "../activity/delete-activity/delete-activity.ts";

export default async function deleteLesson(userId: string, lessonId: number) {
  const existingLesson = await prisma.orm.public.Lesson.where((row) =>
    whereFromObject(row, { id: lessonId }),
  )
    .include("course", (related98) =>
      related98.include("module", (related99) =>
        related99.include("contacts", (related100) =>
          related100.include("contact", (related101) =>
            related101.select("idMdb"),
          ),
        ),
      ),
    )
    .first();

  if (!existingLesson) {
    const error = new Error("La leçon n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  // Vérification des droits
  await userBelongsToContacts(
    userId,
    existingLesson.course!.module!.contacts.map(({ contact }) => contact),
    "Vous n'êtes pas autorisé à supprimer cette leçon.",
  );

  // Récupérer les activités avant de supprimer la leçon
  const activities = await prisma.orm.public.Activity.where((row) =>
    whereFromObject(row, { lessonId }),
  ).all();

  // Supprimer les activités
  for (const act of activities) {
    await deleteActivity(act.id, act.type, "lesson");
  }

  // Ouvrir la transaction pour nettoyer la leçon et le reste
  await prisma.transaction(async (tx) => {
    await tx.orm.public.LessonRead.where((row) =>
      whereFromObject(row, { lessonId }),
    )
      .deleteAndCount()
      .then((count) => ({ count }));

    await tx.orm.public.LessonRating.where((row) =>
      whereFromObject(row, { lessonId }),
    )
      .deleteAndCount()
      .then((count) => ({ count }));

    await tx.orm.public.Lesson.where((row) =>
      whereFromObject(row, { id: lessonId }),
    )
      .delete()
      .then(requireDatabaseRow);
  });

  return true;
}
