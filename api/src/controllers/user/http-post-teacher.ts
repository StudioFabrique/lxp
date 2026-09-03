import { type Response } from "express";
import { validationResult } from "express-validator";

import postTeacher from "../../models/user/post-teacher.ts";
import { serverIssue } from "../../utils/constantes.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

async function httpPostTeacher(req: CustomRequest, res: Response) {
  const result: any = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  try {
    const actorRank = Math.min(
      ...req.auth!.userRoles.map(({ rank }) => rank),
      4,
    );
    if (actorRank >= 2) {
      return res.status(403).json({
        message:
          "Vous ne pouvez créer qu'un utilisateur de rang inférieur au vôtre.",
      });
    }
    const teacher = req.body;
    const response = await postTeacher(teacher);

    return res.status(201).json({
      success: true,
      message:
        "Ressource pédagogique créée. Le mail d'activation est en cours d'envoi.",
      contact: response,
    });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message: error.statusCode !== 500 ? error.message : serverIssue,
    });
  }
}

export default httpPostTeacher;
