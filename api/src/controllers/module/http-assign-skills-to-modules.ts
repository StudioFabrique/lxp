import type { NextFunction, Response } from "express";

import assignSkillsToModules from "../../models/module/assign-skills-to-modules.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { resolveAccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

export default async function httpAssignSkillsToModules(
  req: CustomRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const result = await assignSkillsToModules(
      {
        parcoursId: Number(req.params.parcoursId),
        moduleIds: req.body.moduleIds,
        skillIds: req.body.skillIds,
      },
      await resolveAccessScope(req.auth!),
    );

    next({
      statusCode: 200,
      data: {
        success: true,
        message: "Compétences ajoutées avec succès",
        assignmentsCreated: result.count,
      },
    });
  } catch (error) {
    const apiError = error as { statusCode?: number; message?: string };
    next({
      statusCode: apiError.statusCode ?? 500,
      message:
        apiError.message ?? "Les compétences n'ont pas pu être ajoutées.",
    });
  }
}
