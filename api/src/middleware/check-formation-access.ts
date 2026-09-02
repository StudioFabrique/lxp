import { type NextFunction, type Response } from "express";
import { noData } from "../utils/constantes.ts";
import { prisma } from "../utils/db.ts";
import type CustomRequest from "../utils/interfaces/express/custom-request.ts";
import { resolveAccessScope } from "../utils/services/permissions/accessible-parcours.ts";

/** Restreint une formation à celles qui contiennent un parcours accessible. */
export default function checkFormationAccess(parameterName = "formationId") {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.auth) return res.status(401).json({ message: "Session absente" });

      const scope = await resolveAccessScope(req.auth);
      if (scope === null) return next();

      const rawId = req.params[parameterName] ?? req.body?.[parameterName];
      const formationId = Number(rawId);
      if (!Number.isInteger(formationId) || formationId <= 0) {
        return res.status(404).json({ message: noData });
      }

      const existsInScope = await prisma.formation.findFirst({
        where: {
          id: formationId,
          parcours: {
            some: {
              id: {
                in:
                  scope.kind === "teacher" && req.method !== "GET"
                    ? scope.directParcoursIds ?? []
                    : scope.parcoursIds,
              },
            },
          },
        },
        select: { id: true },
      });

      if (!existsInScope) return res.status(404).json({ message: noData });
      next();
    } catch (error) {
      next(error);
    }
  };
}
