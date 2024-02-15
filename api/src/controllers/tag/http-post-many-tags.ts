import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import postManyTags from "../../models/tag/post-many-tags";

export default async function httpPostManyTags(req: Request, res: Response) {
  try {
    const { tags } = req.body;
    const response = await postManyTags(tags);
    return res.status(201).json(response);
  } catch (error: any) {
    return res.status(500).json({ message: serverIssue });
  }
}
