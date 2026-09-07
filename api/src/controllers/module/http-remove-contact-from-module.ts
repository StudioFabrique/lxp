import type { NextFunction, Response } from "express";

import removeContactFromModule from "../../models/module/remove-contact-from-module.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { resolveAccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

export default async function httpRemoveContactFromModule(
  req: CustomRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    await removeContactFromModule(
      {
        parcoursId: Number(req.params.parcoursId),
        moduleId: Number(req.params.moduleId),
        contactId: Number(req.params.contactId),
      },
      await resolveAccessScope(req.auth!),
      req.auth?.userId,
    );

    next({
      statusCode: 200,
      data: {
        success: true,
        message: "Ressource pédagogique retirée du module avec succès",
      },
    });
  } catch (error) {
    const apiError = error as { statusCode?: number; message?: string };
    next({
      statusCode: apiError.statusCode ?? 500,
      message:
        apiError.message ??
        "La ressource pédagogique n'a pas pu être retirée du module.",
    });
  }
}
