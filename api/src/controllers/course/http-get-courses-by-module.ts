import { type Request, type Response } from "express";
import { badQuery, serverIssue } from "../../utils/constantes.ts";
import getCoursesByModule from "../../models/course/get-courses-by-module.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

async function httpGetCoursesByModule(req: CustomRequest, res: Response) {
  const { moduleId } = req.params;
  const userId = req.auth?.userId;

  if (!userId) return res.status(400).json({ message: badQuery });

  try {
    const response = await getCoursesByModule(parseInt(moduleId), userId);
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
