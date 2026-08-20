import { type Request, type Response } from "express";
import { validationResult } from "express-validator";

import postTeacher from "../../models/user/post-teacher.ts";
import { serverIssue } from "../../utils/constantes.ts";

async function httpPostTeacher(req: Request, res: Response) {
  const result: any = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  try {
    const teacher = req.body;
    const response = await postTeacher(teacher);

    return res.status(201).json({
      success: true,
      message: "Formateur créé avec succès",
      contact: response,
    });
  } catch (error: any) {

    return res.status(error.statusCode ?? 500).json({
      message: error.statusCode !== 500 ? error.message : serverIssue,
    });
  }
}

export default httpPostTeacher;
