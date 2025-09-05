import { Request, Response, NextFunction } from "express";
import { serverIssue } from "../../utils/constantes";
import getResourcesList from "../../models/resources/get-resources-list";

export default async function httpGetResourcesList(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const resources = await getResourcesList();
    next({
      statusCode: 200,
      data: resources,
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: serverIssue,
    });
  }
}
