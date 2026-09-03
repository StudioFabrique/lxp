import type { NextFunction, Response } from "express";
import { noData } from "../utils/constantes.ts";
import type CustomRequest from "../utils/interfaces/express/custom-request.ts";
import { canAccessGroups } from "../utils/services/permissions/accessible-groups.ts";
import checkContentAccess from "./check-content-access.ts";

type GroupIdSource = {
  location: "params" | "query" | "body";
  key?: string;
  commaSeparated?: boolean;
  allowEmpty?: boolean;
};

/** À placer après les validateurs d'identifiants et `checkPermissions`. */
export function checkGroupAccess(source: GroupIdSource) {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.auth) {
        return res.status(401).json({ message: "Session absente" });
      }

      const container = req[source.location] as unknown;
      const rawValue = source.key
        ? (container as Record<string, unknown>)[source.key]
        : container;
      const groupIds = Array.isArray(rawValue)
        ? rawValue.map(String).filter(Boolean)
        : source.commaSeparated
          ? String(rawValue ?? "").split(",").filter(Boolean)
          : [String(rawValue ?? "")].filter(Boolean);

      if (source.allowEmpty && groupIds.length === 0) return next();

      if (!(await canAccessGroups(req.auth, groupIds))) {
        return res.status(404).json({ message: noData });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Empêche un formateur de rattacher un groupe à un parcours hors périmètre.
 * L'absence de parcours correspond à un groupe non rattaché et reste permise.
 */
export function checkGroupParcoursAccess(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  const parcoursId = Number(req.body.data?.parcoursId);
  if (!Number.isInteger(parcoursId) || parcoursId <= 0) return next();

  return checkContentAccess("parcours", "data.parcoursId")(req, res, next);
}
