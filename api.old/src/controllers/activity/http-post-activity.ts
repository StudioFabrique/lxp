import { Response } from "express";

import { serverIssue } from "../../utils/constantes";
import postText from "../../models/activity/post-activity/post-text";
import CustomRequest from "../../utils/interfaces/express/custom-request";

export default async function httpPostActivity(
  req: CustomRequest,
  res: Response
) {
  try {
    const { lessonId } = req.params;
    const userId = req.auth?.userId;
    const { value, order, type } = req.body;

    let response: any = {};

    switch (type) {
      case "text":
        response = await postText(+lessonId, userId!, value, type, order);
        break;
    }
    return res.status(201).json(response);
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
