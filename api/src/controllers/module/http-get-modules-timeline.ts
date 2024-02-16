import { Response } from "express";
import { badQuery, serverIssue } from "../../utils/constantes";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import getModulesTimeline from "../../models/module/get-modules-timeline";

export default async function httpGetModulesTimeline(
  req: CustomRequest,
  res: Response
) {
  const userId = req.auth?.userId;

  if (!userId) {
    return res.status(404).json({ message: badQuery });
  }

  try {
    const response = await getModulesTimeline(userId, 6);
    return res.status(200).json({
      message: "La timeline des modules ont bien étés récupérés",
      data: response,
    });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
