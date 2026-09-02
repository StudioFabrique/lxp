import { type NextFunction, type Response } from "express";
import deleteManyUsers from "../../models/user/delete-many-users.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

export default async function httpDeleteManyUsers(
  req: CustomRequest,
  _res: Response,
  next: NextFunction,
) {
  const connectedId = req.auth?.userId;
  const ids = typeof req.query.ids === "string" ? req.query.ids.split(",") : [];

  if (!connectedId) {
    next({ statusCode: 401, message: "Session absente ou expirée" });
    return;
  }

  try {
    await deleteManyUsers(ids, connectedId);
    next({
      statusCode: 200,
      data: {
        success: true,
        message: "Les utilisateurs ont été supprimés avec succès",
      },
    });
  } catch (error: any) {
    next({
      statusCode: error?.statusCode ?? 500,
      message:
        error?.message ??
        "Une erreur est survenue lors de la suppression des utilisateurs.",
    });
  }
}
