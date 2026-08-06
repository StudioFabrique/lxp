import { type NextFunction, type Response } from "express";

import postDuplicateResources from "../../models/lesson/post-duplicate-resources.ts";
import { serverIssue } from "../../utils/constantes.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

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
