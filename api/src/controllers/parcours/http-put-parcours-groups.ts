import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import putParcoursGroups from "../../models/parcours/put-parcours-groups";

async function httpPutParcoursGroups(req: Request, res: Response) {
  const { parcoursId, groupsIds } = req.body;

  try {
    const response = await putParcoursGroups(+parcoursId, groupsIds);
    if (response) {
      return res
        .status(201)
        .json({
          success: true,
          data: response,
          message: "Parcours mis à jour avec succès",
        });
    }
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}

export default httpPutParcoursGroups;
