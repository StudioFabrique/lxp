import { Response } from "express";
import CustomRequest from "../../../utils/interfaces/express/custom-request";
import { noAccess, serverIssue } from "../../../utils/constantes";
import postFeedBack from "../../../models/user/feedback/post-feedback";

export default async function httpPostFeedback(
  req: CustomRequest,
  res: Response
) {
  try {
    if (!req.auth) {
      return res.status(403).json({ message: noAccess });
    }

    const { userId } = req.auth;

    const { feelingLevel, comment } = req.body;

    const response = await postFeedBack(userId, feelingLevel, comment);

    return res.status(200).json({ data: response });
  } catch (error) {
    return res.status(500).json({ message: serverIssue });
  }
}
