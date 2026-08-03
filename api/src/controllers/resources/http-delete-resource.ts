import { type Response, type NextFunction } from "express";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { serverIssue } from "../../utils/constantes.ts";
import deleteResource from "../../models/resources/delete-resource.ts";

export default async function httpDeleteResource(
  req: CustomRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const { resourceId } = req.params;
    await deleteResource(+resourceId, req.auth?.userId!);
    next({
      statusCode: 200,
      data: {
        success: true,
        message: "La ressource a été supprimée avec succès.",
      },
    });
  } catch (error: any) {
    next({
      statusCode: error.statusCode ?? 500,
      message: error.message ?? serverIssue,
    });
  }
}
