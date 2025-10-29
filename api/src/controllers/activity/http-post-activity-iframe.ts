import { Response } from "express";

import { serverIssue } from "../../utils/constantes";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import postIframe from "../../models/activity/post-activity/post-iframe";

export default async function httpPostActivityIframe(
  req: CustomRequest,
  res: Response
) {
  try {
    const { lessonId } = req.params;
    const userId = req.auth?.userId;
    const { title, description, url } = req.body;

    const response = await postIframe(
      +lessonId,
      userId!,
      title,
      description,
      url
    );

    return res.status(201).json(response);
  } catch (error: any) {
    console.log({ error });

    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
