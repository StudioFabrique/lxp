import CustomRequest from "../../utils/interfaces/express/custom-request";
import { Response, NextFunction } from "express";
import putDialogs from "../../models/chatbot/put-dialogs";
import { stat } from "fs";
import { serverIssue } from "../../utils/constantes";

export default async function httpPutDialogs(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.auth?.userId;
    const { lastDialogs } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await putDialogs(userId, lastDialogs);

    next({
      statusCode: 201,
      data: { success: true, message: "Dialogs saved successfully" },
    });
  } catch (error: any) {
    console.log({ error });

    next({
      statusCode: error.statusCode ?? 500,
      message: error.message ?? serverIssue,
    });
  }
}
