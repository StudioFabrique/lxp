import { Request, Response } from "express";
import { serverIssue } from "../../../utils/constantes";
import getLastFeedbacks from "../../../models/user/feedback/get-last-feedbacks";

export default async function httpGetLastFeedbacks(
  req: Request,
  res: Response
) {
  try {
    const response = await getLastFeedbacks();
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
