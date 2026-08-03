import { type Response } from "express";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import getUserLastParcours from "../../models/user/get-user-last-parcours.ts";
import { serverIssue } from "../../utils/constantes.ts";

export default async function httpGetUserLastParcours(
  req: CustomRequest,
  res: Response
) {
  try {
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
