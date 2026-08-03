import { type Response, type NextFunction } from "express";
import deleteResource from "../../models/activity/delete-resource.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

export default async function httpDeleteResource(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const { resourceId } = req.params;
  const userId = req.auth!.userId;
  try {
    await deleteResource(+resourceId, userId);
    res.status(200).json({
      success: true,
      message: "La ressource a été supprimée avec succès.",
    });
  } catch (error: any) {
    next({ statusCode: error.statusCode ?? 500, message: error.message });
  }
}
