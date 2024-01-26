import { Response } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import getTeacherParcours from "../../models/parcours/get-teacher-parcours";

export default async function httpGetTeacherParcours(
  req: CustomRequest,
  res: Response
) {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      const error: any = {
        message: "L'utilisateur n'est pas authentifié.",
        statusCode: 401,
      };
      throw error;
    }

    const response = await getTeacherParcours(userId);
    return res
      .status(200)
      .json({
        success: true,
        message: response.length === 0 ? "Liste vide." : "",
        response,
      });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
}
