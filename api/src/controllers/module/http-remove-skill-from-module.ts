import type { NextFunction, Response } from "express";

import removeSkillFromModule from "../../models/module/remove-skill-from-module.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { resolveAccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

export default async function httpRemoveSkillFromModule(
  req: CustomRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    await removeSkillFromModule(
      {
        parcoursId: Number(req.params.parcoursId),
        moduleId: Number(req.params.moduleId),
        skillId: Number(req.params.skillId),
      },
      await resolveAccessScope(req.auth!),
    );

    next({
      statusCode: 200,
      data: {
        success: true,
        message: "Compétence retirée du module avec succès",
      },
    });
  } catch (error) {
    const apiError = error as { statusCode?: number; message?: string };
    next({
      statusCode: apiError.statusCode ?? 500,
      message:
        apiError.message ?? "La compétence n'a pas pu être retirée du module.",
    });
  }
}
