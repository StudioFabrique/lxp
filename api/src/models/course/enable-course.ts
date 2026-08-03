import { prisma } from "../../utils/db.ts";

export default async function enableCourse(
  courseId: number,
  visibility: boolean,
) {
  //  récupération du cours à supprimer dans la bdd pour vérifier qu'il existe
  const existingCourse = await prisma.course.findFirst({
    where: {
      id: courseId,
    },
  });

  //  si le cours n'existe pas on retourne une erreur
  if (!existingCourse)
    throw { statusCode: 404, message: "Le cours n'existe pas" };

  await prisma.course.update({
    where: { id: courseId },
    data: { visibility },
  });
}
