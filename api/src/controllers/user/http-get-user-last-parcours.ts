import { Response } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import getUserLastParcours from "../../models/user/get-user-last-parcours";
import { serverIssue } from "../../utils/constantes";

export default async function httpGetUserLastParcours(
  req: CustomRequest,
  res: Response
) {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      const error: any = {
        message:
          "L'utilisateur n'a pas accès à cette ressource ou n'existe pas.",
        statusCode: 403,
      };
      throw error;
    }
    const response = await getUserLastParcours(req.auth!.userId);
    return res.status(200).json({
      success: true,
      message: response.length === 0 ? "Liste vide" : "",
      response,
    });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
