import { type Request, type Response, type NextFunction } from "express";
import getTopFiveUsers from "../../models/dashboard-ia/getTopFiveUsers.ts";
import { badQuery, serverIssue } from "../../utils/constantes.ts";
import { validationResult } from "express-validator";

export default async function httpGetTopFiveUsers(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      next({
        statusCode: 400,
        message: badQuery,
      });
    }

    const { page, limit, searchTerm } = req.query;
    const { stype, sdir } = req.params;
    const response = await getTopFiveUsers(
      parseInt((limit as string) || "10"),
      parseInt((page as string) || "1"),
      stype,
      sdir,
      searchTerm as string,
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
