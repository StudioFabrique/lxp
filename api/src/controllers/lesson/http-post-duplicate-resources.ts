import { NextFunction, Response } from "express";

import postDuplicateResources from "../../models/lesson/post-duplicate-resources";
import { serverIssue } from "../../utils/constantes";
import CustomRequest from "../../utils/interfaces/express/custom-request";

export default async function httpPostDuplicateResources(
  req: CustomRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const response = await postDuplicateResources(
      +req.params.courseId,
      req.body,
      req.auth!.userId,
    );
    next({
      statusCode: 201,
      data: {
        success: true,
        message: "Ressource(s) importée(s) avec succès",
        response,
      },
    });
  } catch (error: any) {
    next({
      statusCode: error.statusCode ?? 500,
      message: error.message ?? serverIssue,
    });
  }
}
