import { Response, NextFunction } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { serverIssue } from "../../utils/constantes";
import deleteResource from "../../models/resources/delete-resource";

export default async function httpDeleteResource(
  req: CustomRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const { resourceId } = req.params;
    await deleteResource(+resourceId, req.auth?.userId!, req.auth?.userRoles!);
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
