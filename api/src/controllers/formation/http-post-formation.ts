import { type Response } from "express";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { serverIssue } from "../../utils/constantes.ts";
import postFormation from "../../models/formation/post-formation.ts";
import { validationResult } from "express-validator";

export default async function httpPostFormation(
  req: CustomRequest,
  res: Response
) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    //console.log("Validation errors:", result.array());

    return res.status(400).json({ errors: result.array() });
  }

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
