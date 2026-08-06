import { type Response } from "express";
import { badQuery, serverIssue } from "../../../utils/constantes.ts";
import getLastFeedbacks from "../../../models/user/feedback/get-last-feedbacks.ts";
import type CustomRequest from "../../../utils/interfaces/express/custom-request.ts";
import { validationResult } from "express-validator";

export default async function httpGetLastFeedbacks(
  req: CustomRequest,
  res: Response
) {
  try {
    const result = validationResult(req);

    if (!result.isEmpty())
      return res.status(400).json({ errors: result.array() });

    const userId = req.auth?.userId;

    if (!userId) {
      throw {
        message: "L'utilisateur n'est pas authentifié.",
        statusCode: 401,
      };
    }

    const { notReviewed } = req.params;

    const response = await getLastFeedbacks(userId!, notReviewed === "true");
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
