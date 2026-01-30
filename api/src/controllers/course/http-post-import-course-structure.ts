import { Response } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { prisma } from "../../utils/db";
import postCourseStructure from "../../models/course/post-course-structure";

export default async function httpPostImportCourseStructure(
  req: CustomRequest,
  res: Response,
) {
  const userId = req.auth?.userId;
  const { title, description, lessons, parcoursId, moduleId } = req.body;

  try {
    const admin = await prisma.admin.findFirst({ where: { idMdb: userId } });
    if (!admin) return res.status(404).json({ message: "Admin introuvable" });

    const result = await postCourseStructure(
      admin.id,
      moduleId,
      title,
      description,
      lessons,
    );

    return res.status(201).json(result);
  } catch (error: any) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur lors de l'import de la structure." });
  }
}
