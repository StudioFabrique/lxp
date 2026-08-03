import { type Response } from "express";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import postCourseStructure from "../../models/course/post-course-structure.ts";
import getAdminId from "../../models/course/get-admin-id.ts";

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
