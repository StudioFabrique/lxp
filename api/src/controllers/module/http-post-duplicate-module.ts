import { Response, NextFunction } from "express";

import { validationResult } from "express-validator";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { stat } from "fs";
import { serverIssue } from "../../utils/constantes";
import postDuplicateModule from "../../models/module/post-duplicate-module";

export default async function httpPostDuplicateModule(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { moduleId } = req.params;
    const { contacts, duration, parcoursId, skills } = req.body;

    const response = await postDuplicateModule(
      parseInt(moduleId, 10),
      {
        contactsIds: contacts ?? [],
        skillsIds: skills ?? [],
      },
      req.auth!.userId,
      parseInt(parcoursId, 10)
    );
    next({
      statusCode: 200,
      message: "Module dupliqué avec succès",
      response,
    });
  } catch (error: any) {
    console.log({ error });
    next({
      statusCode: error.statusCode ?? 500,
      message: error.message ?? serverIssue,
    });
  }
}
