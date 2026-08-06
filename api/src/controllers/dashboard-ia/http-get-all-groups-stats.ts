import { type Request, type Response, type NextFunction } from "express";
import getAllGroupsStats from "../../models/dashboard-ia/getAllGroupsStats.ts";

export default async function httpGetAllGroupsStats(
  _req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const response = await getAllGroupsStats();
    next({ statusCode: 200, data: response });
  } catch (error: any) {
    next({
      statusCode: error.statusCode ?? 500,
      message: error.message ?? "Problème serveur",
    });
  }
}
