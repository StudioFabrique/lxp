import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { type Response, type NextFunction } from "express";
import { serverIssue } from "../../utils/constantes.ts";
import getDialogs from "../../models/chatbot/get-dialogs.ts";

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
