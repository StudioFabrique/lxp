import { Response } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { serverIssue } from "../../utils/constantes";
import postFormation from "../../models/formation/post-formation";

export default async function httpPostFormation(
  req: CustomRequest,
  res: Response
) {
  try {
    const userId = req.auth?.userId;
    const { title, description, code, level, tags } = req.body;
    const response = await postFormation(
      userId!,
      title,
      description,
      code,
      level,
      tags
    );
    return res
      .status(201)
      .json({ success: true, message: "Formation enregistrée.", response });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
