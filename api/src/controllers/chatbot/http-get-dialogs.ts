import CustomRequest from "../../utils/interfaces/express/custom-request";
import { Response, NextFunction } from "express";
import { serverIssue } from "../../utils/constantes";
import getDialogs from "../../models/chatbot/get-dialogs";

export default async function httpGetDialogs(
  req: CustomRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw { statusCode: 400, message: "User ID is required" };
    const response = await getDialogs(userId);
    next({
      statusCode: 200,
      data: { success: true, dialogs: response },
    });
  } catch (error: any) {
    console.log({ error });

    next({
      statusCode: error.statusCode ?? 500,
      message: error.message ?? serverIssue,
    });
  }
}
