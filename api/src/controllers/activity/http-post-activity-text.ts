import { type Response } from "express";

import { serverIssue } from "../../utils/constantes.ts";
import postText from "../../models/activity/post-activity/post-text.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

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

    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
