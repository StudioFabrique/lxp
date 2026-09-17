import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import { prisma } from "../../utils/db.ts";

export default async function enableCourse(
  courseId: number,
  visibility: boolean,
) {
  //  récupération du cours à supprimer dans la bdd pour vérifier qu'il existe
  const existingCourse = await prisma.orm.public.Course.where({
    id: courseId,
  }).first();

  //  si le cours n'existe pas on retourne une erreur
  if (!existingCourse)
    throw { statusCode: 404, message: "Le cours n'existe pas" };

  await prisma.orm.public.Course.where({ id: courseId })
    .update({ visibility })
    .then(requireDatabaseRow);
}
