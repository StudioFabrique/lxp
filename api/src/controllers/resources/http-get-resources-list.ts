import { type Request, type Response, type NextFunction } from "express";
import { regexGeneric, serverIssue } from "../../utils/constantes.ts";
import getResourcesList from "../../models/resources/get-resources-list.ts";

export default async function httpGetResourcesList(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const { stype, sdir } = req.params;
    const { page = 1, limit = 10, searchTerm } = req.query;

    if (typeof searchTerm === "string" && !regexGeneric.test(searchTerm)) {
      next({
        statusCode: 400,
        message: "Invalid search term",
      });
      return;
    }

    const resources = await getResourcesList(
      stype,
      sdir,
      +page,
      +limit,
      typeof searchTerm === "string" ? searchTerm : undefined,
    );
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
