import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { badQuery } from "../../utils/constantes";
import postTeacher from "../../models/user/post-teacher";

async function httpPostTeacher(req: Request, res: Response) {
  const result: any = validationResult(req);

  if (!result.isEmpty()) {
    console.log(result.errors);

    return res.status(400).json({ message: badQuery });
  }

  try {
    const teacher = req.body;
    const response = await postTeacher(teacher);
    if (response) {
      return res.status(201).json({
        success: true,
        message: "Formateur créé avec succès",
        contact: response,
      });
    } else {
      throw new Error("L'utilisateur n'a pas été créé");
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export default httpPostTeacher;
