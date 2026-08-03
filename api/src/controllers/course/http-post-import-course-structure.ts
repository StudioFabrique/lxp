import { Response } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import postCourseStructure from "../../models/course/post-course-structure";
import getAdminId from "../../models/course/get-admin-id";

export default async function httpPostImportCourseStructure(
  req: CustomRequest,
  res: Response,
) {
  const userId = req.auth?.userId;
  const { title, description, lessons, parcoursId, moduleId, courseSlug } =
    req.body;

  try {
    const adminId = await getAdminId(userId);
    if (!adminId) return res.status(404).json({ message: "Admin introuvable" });

    const result = await postCourseStructure(
      adminId,
      moduleId,
      title,
      description,
      lessons,
      courseSlug,
    );

    return res.status(201).json(result);
  } catch (error: any) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur lors de l'import de la structure." });
  }
}
