import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import getCourses from "../../models/course/get-courses";

async function httpGetCoursesByModule(req: Request, res: Response) {
  const { moduleId } = req.params;

  try {
    const response = await getCourses();
    return res.status(200).json({
      success: true,
      message:
        response.length === 0
          ? "Liste vide."
          : "Liste téléchargée avec succès.",
      response,
    });
  } catch (error: any) {
    return res.status(500).json({ message: serverIssue });
  }
}

export default httpGetCoursesByModule;
