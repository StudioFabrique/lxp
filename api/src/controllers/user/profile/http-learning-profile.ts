import type { Response } from "express";
import type CustomRequest from "../../../utils/interfaces/express/custom-request.ts";
import {
  getLearningContext,
  updateModuleAssessment,
  updateLearningProfile,
} from "../../../models/learning-profile/learning-profile.ts";

function sendError(res: Response, error: unknown) {
  const typed = error as { statusCode?: number; message?: string };
  return res.status(typed.statusCode ?? 500).json({
    message: typed.message ?? "Impossible de charger le profil d'apprentissage.",
  });
}

export async function httpGetLearningProfile(req: CustomRequest, res: Response) {
  try {
    return res.status(200).json(await getLearningContext(req.auth!.userId));
  } catch (error) {
    return sendError(res, error);
  }
}

export async function httpPatchLearningProfile(req: CustomRequest, res: Response) {
  try {
    return res
      .status(200)
      .json(await updateLearningProfile(req.auth!.userId, req.body));
  } catch (error) {
    return sendError(res, error);
  }
}

export async function httpPutModuleAssessment(
  req: CustomRequest<{ moduleId: string }>,
  res: Response,
) {
  try {
    return res.status(200).json(
      await updateModuleAssessment(
        req.auth!.userId,
        Number(req.params.moduleId),
        req.body.level,
      ),
    );
  } catch (error) {
    return sendError(res, error);
  }
}
