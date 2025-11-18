import { Response, NextFunction } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { serverIssue } from "../../utils/constantes";
import postModuleMetadata from "../../models/module/post-module-metadata";

export default async function httpPostModuleMetadata(
  req: CustomRequest,
  _res: Response,
  next: NextFunction
) {
  const { parcoursId, moduleId } = req.body;
  const { contactIds, skillIds } = req.body;
  const userId = req.auth?.userId;

  try {
    await postModuleMetadata(
      moduleId,
      parcoursId,
      contactIds,
      skillIds,
      userId!
    );
    next({
      statusCode: 201,
      data: { success: true, message: "Module metadata created successfully" },
    });
  } catch (error: any) {
    console.log({ error });
    next({
      statusCode: error.statusCode ?? 500,
      message: error.message ?? serverIssue,
    });
  }
}
