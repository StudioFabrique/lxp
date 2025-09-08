import { Request, Response, NextFunction } from "express";
import { serverIssue } from "../../utils/constantes";
import getResourcesList from "../../models/resources/get-resources-list";

export default async function httpGetResourcesList(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const { stype, sdir } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const resources = await getResourcesList(stype, sdir, +page, +limit);
    next({
      statusCode: 200,
      data: { total: resources.totaltResources, list: resources.resources },
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: serverIssue,
    });
  }
}
