import {
  requireDatabaseRow,
  whereFromObject,
} from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";
import userBelongsToContacts from "../../utils/userBelongsToContacts.ts";
import deleteLesson from "../lesson/delete-lesson.ts";

export default async function deleteCourse(courseId: number, userId: string) {
  // Récupération du cours et des IDs de ses leçons
  const existingCourse = await prisma.orm.public.Course.where((row) =>
    whereFromObject(row, {
      id: courseId,
    }),
  )
    .include("lessons", (related23) => related23.select("id"))
    .include("assignment", (related24) =>
      related24
        .include("files", (related25) => related25.select("storedName"))
        .include("submissions", (related26) =>
          related26.include("files", (related27) =>
            related27.select("storedName"),
          ),
        ),
    )
    .include("module", (related28) =>
      related28.include("contacts", (related29) =>
        related29.include("contact", (related30) => related30.select("idMdb")),
      ),
    )
    .first();

  // Si le cours n'existe pas on retourne une erreur
  if (!existingCourse) {
    throw { statusCode: 404, message: "Le cours n'existe pas" };
  }

  // Vérification des droits
  await userBelongsToContacts(
    userId,
    existingCourse.module!.contacts.map((contact) => contact.contact),
    "Vous n'êtes pas autorisé à supprimer ce cours.",
  );

  // Suppression propre de chaque leçon (en cascade)
  for (const lesson of existingCourse.lessons) {
    await deleteLesson(userId, lesson.id);
  }

  // Suppression du cours dans la base de données
  await prisma.orm.public.Course.where((row) =>
    whereFromObject(row, {
      id: courseId,
    }),
  )
    .delete()
    .then(requireDatabaseRow);

  return [
    ...(existingCourse.assignment?.files ?? []).map((file) => file.storedName),
    ...(existingCourse.assignment?.submissions ?? []).flatMap((submission) =>
      submission.files.map((file) => file.storedName),
    ),
  ];
}
