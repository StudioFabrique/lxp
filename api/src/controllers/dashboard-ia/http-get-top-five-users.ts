import { Request, Response, NextFunction } from "express";
import getTopFiveUsers from "../../models/dashboard-ia/getTopFiveUsers";
import { serverIssue } from "../../utils/constantes";

export default async function httpGetTopFiveUsers(
  _req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const response = await getTopFiveUsers();
    next({
      statusCode: 200,
      data: response,
    });
  } catch (error: any) {
    next({
      statusCode: error.statusCode ?? 500,
      message: error.message ?? serverIssue,
    });
  }
}
