import { Response } from "express";

import { serverIssue } from "../../utils/constantes";
import postText from "../../models/activity/post-activity/post-text";
import CustomRequest from "../../utils/interfaces/express/custom-request";

export default async function httpPostActivityText(
  req: CustomRequest,
  res: Response
) {
  try {
    const { parentId } = req.params;
    const userId = req.auth?.userId;
    const { title, description, value, parent } = req.body;

    let response: any = {};

    response = await postText(
      +parentId,
      userId!,
      title,
      description,
      value,
      parent
    );
    return res.status(201).json(response);
  } catch (error: any) {
    console.log({ error });

    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
