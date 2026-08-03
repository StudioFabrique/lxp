import { type Request, type Response } from "express";
import { serverIssue } from "../../utils/constantes.ts";
import postManyTags from "../../models/tag/post-many-tags.ts";

export default async function httpPostManyTags(req: Request, res: Response) {
  try {
    const { tags } = req.body;
    const response = await postManyTags(tags);
    return res.status(201).json(response);
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.statusCode ? error.message : serverIssue });
  }
}
