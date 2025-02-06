import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import putPublishParcours from "../../models/parcours/put-publish-parcours";

async function httpPublishParcours(req: Request, res: Response) {
  const { parcoursId } = req.params;
  const { isPublished } = req.body;
  try {
    const response = await putPublishParcours(+parcoursId, isPublished);
    return res
      .status(201)
      .json({
        success: true,
        message: isPublished
          ? "Le parcours a été publié"
          : "Le parcours est maintenant sauvegardé en tant que brouillon",
      });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}

export default httpPublishParcours;
