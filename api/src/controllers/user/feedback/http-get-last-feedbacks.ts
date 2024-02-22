import { Response } from "express";
import { serverIssue } from "../../../utils/constantes";
import getLastFeedbacks from "../../../models/user/feedback/get-last-feedbacks";
import CustomRequest from "../../../utils/interfaces/express/custom-request";

export default async function httpGetLastFeedbacks(
  req: CustomRequest,
  res: Response
) {
  try {
    const userId = req.auth?.userId;
    const response = await getLastFeedbacks(userId!);
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
