import { prisma } from "../../utils/db";

export default async function deleteCourse(courseId: number) {
  //  récupération du cours à supprimer dans la bdd pour vérifier qu'il existe
  const existingCourse = await prisma.course.findFirst({
    where: {
      id: courseId,
    },
  });
  //  si le cours n'existe pas on retourne une erreur
  if (!existingCourse)
    throw { statusCode: 404, message: "Le cours n'existe pas" };

  //  suppression du cours et de ses relations
  await prisma.course.delete({
    where: {
      id: courseId,
    },
  });
}
