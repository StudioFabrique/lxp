import { Request, Response } from "express";

import { serverIssue } from "../../utils/constantes";
import postText from "../../models/activity/post-activity/post-text";

export default async function httpPostActivity(req: Request, res: Response) {
  try {
    const { lessonId } = req.params;

    const { value, order, type } = req.body;

    let response: any = {};

    switch (type) {
      case "text":
        response = await postText(+lessonId, value, type, order);
        break;
    }
    return res.status(201).json(response);
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
