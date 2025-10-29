import { Response } from "express";

import { serverIssue } from "../../utils/constantes";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import putIframe from "../../models/activity/update-activity/put-iframe";

export default async function httpPutActivityIframe(
  req: CustomRequest,
  res: Response
) {
  try {
    const { activityId } = req.params;
    const userId = req.auth?.userId;
    const { title, description, url } = req.body;

    const response = await putIframe(
      +activityId,
      userId!,
      title,
      description,
      url
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
