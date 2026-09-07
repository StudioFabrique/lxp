import { type Response } from "express";
import { serverIssue } from "../../utils/constantes.ts";
import postManyTags from "../../models/tag/post-many-tags.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

export default async function httpPostManyTags(
  req: CustomRequest,
  res: Response,
) {
  try {
    const { tags } = req.body;
    const response = await postManyTags(tags, {
      userId: req.auth!.userId,
      isAdmin: req.auth!.userRoles.some(({ rank }) => rank <= 1),
    });
    return res.status(201).json(response);
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.statusCode ? error.message : serverIssue });
  }
}
