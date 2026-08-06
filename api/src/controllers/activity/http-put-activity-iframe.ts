import { type Response } from "express";

import { serverIssue } from "../../utils/constantes.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import putIframe from "../../models/activity/update-activity/put-iframe.ts";

export default async function httpPutActivityIframe(
  req: CustomRequest,
  res: Response,
) {
  try {
    const { activityId } = req.params;
    const userId = req.auth?.userId;
    const { title, description, url, parent = "lesson" } = req.body;

    const response = await putIframe(
      +activityId,
      userId!,
      title,
      description,
      url,
      parent,
    );

    console.log({ response });

    return res.status(201).json(response);
  } catch (error: any) {
    console.log({ error });

    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
