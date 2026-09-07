import type { NextFunction, Response } from "express";

import assignContactsToModules from "../../models/module/assign-contacts-to-modules.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { resolveAccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

export default async function httpAssignContactsToModules(
  req: CustomRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const result = await assignContactsToModules(
      {
        parcoursId: Number(req.params.parcoursId),
        moduleIds: req.body.moduleIds,
        contactIds: req.body.contactIds,
      },
      await resolveAccessScope(req.auth!),
    );

    next({
      statusCode: 200,
      data: {
        success: true,
        message: "Ressources pédagogiques affectées avec succès",
        assignmentsCreated: result.count,
      },
    });
  } catch (error) {
    const apiError = error as { statusCode?: number; message?: string };
    next({
      statusCode: apiError.statusCode ?? 500,
      message:
        apiError.message ??
        "Les ressources pédagogiques n'ont pas pu être affectées.",
    });
  }
}
