import { type Request, type Response, type NextFunction } from "express";
import { serverIssue } from "../../utils/constantes.ts";
import getResourceDetails from "../../models/resources/get-resource-details.ts";

export default async function httpGetResourceDetails(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const resourceId = parseInt(req.params.resourceId);

    const resourceDetails = await getResourceDetails(resourceId);
    next({
      statusCode: 200,

      data: { resourceDetails },
    });
  } catch (error: any) {
    next({
      statusCode: error.statusCode ?? 500,
      message: error.message ?? serverIssue,
    });
  }
}
