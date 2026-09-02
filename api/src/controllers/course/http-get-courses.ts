import { type Response } from "express";
import { serverIssue } from "../../utils/constantes.ts";
import getCourses from "../../models/course/get-courses.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { resolveAccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

async function httpGetCourses(req: CustomRequest, res: Response) {
  try {
    const response = await getCourses(await resolveAccessScope(req.auth!));
    return res
      .status(200)
      .json({
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

export default httpGetCourses;
