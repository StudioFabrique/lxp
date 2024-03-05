import { Response } from "express";
import { badQuery, serverIssue } from "../../../utils/constantes";
import getLastFeedbacks from "../../../models/user/feedback/get-last-feedbacks";
import CustomRequest from "../../../utils/interfaces/express/custom-request";

export default async function httpGetLastFeedbacks(
  req: CustomRequest,
  res: Response
) {
  try {
    const userId = req.auth?.userId;
    console.log("controller : userId");

    if (!userId) {
      throw {
        message: "L'utilisateur n'est pas authentifié.",
        statusCode: 401,
      };
    }

    const { notReviewed } = req.params;
    if (notReviewed !== "true" && notReviewed !== "false") {
      return res.status(400).json({ message: badQuery });
    }
    const response = await getLastFeedbacks(userId!, notReviewed === "true");
    return res.status(200).json({
      success: true,
      message: response.length === 0 ? "Liste vide" : "",
      response,
    });
  } catch (error: any) {
    console.log("ERREUR : ", error.message);

    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
