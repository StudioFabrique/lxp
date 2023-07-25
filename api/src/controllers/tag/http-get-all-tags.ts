import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import getAllTags from "../../models/tag/get-all-tags";

async function httpGetAllTags(req: Request, res: Response) {
  try {
    const result = await getAllTags();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: serverIssue + error });
  }
}

export default httpGetAllTags;
