import { Request, Response, NextFunction } from "express";
import getTopFiveUsers from "../../models/dashboard-ia/getTopFiveUsers";
import { serverIssue } from "../../utils/constantes";

export default async function httpGetTopFiveUsers(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const { page, limit } = req.query;
    const { sortBy, direction } = req.params;
    const response = await getTopFiveUsers(
      parseInt((limit as string) || "10"),
      parseInt((page as string) || "1"),
      sortBy,
      direction,
    );
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
