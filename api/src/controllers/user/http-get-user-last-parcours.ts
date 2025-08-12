import { Response } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import getUserLastParcours from "../../models/user/get-user-last-parcours";
import { serverIssue } from "../../utils/constantes";

export default async function httpGetUserLastParcours(
  req: CustomRequest,
  res: Response
) {
  try {
    console.log(req.auth?.userId);

    const response = await getUserLastParcours(req.auth!.userId);
    return res.status(200).json({
      success: true,
      message: response.length === 0 ? "Liste vide" : "",
      response,
    });
  } catch (error: any) {
    console.log("ERROR", error);

    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
