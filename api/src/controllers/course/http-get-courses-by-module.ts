import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import getCoursesByModule from "../../models/course/get-courses-by-module";
import CustomRequest from "../../utils/interfaces/express/custom-request";

async function httpGetCoursesByModule(req: CustomRequest, res: Response) {
  const { moduleId } = req.params;

  try {
    const response = await getCoursesByModule(parseInt(moduleId));
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
