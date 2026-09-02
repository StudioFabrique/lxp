import { type NextFunction, type Response } from "express";
import Role from "../utils/interfaces/db/role.ts";
import User from "../utils/interfaces/db/user.ts";
import type CustomRequest from "../utils/interfaces/express/custom-request.ts";

type IdSource =
  | { location: "params" | "body"; key: string; multiple?: boolean }
  | { location: "query"; key: string; commaSeparated: true };

/**
 * Empêche la gestion d'un compte de rang égal ou supérieur à l'appelant.
 * Le même garde couvre les opérations unitaires, groupées et l'attribution de
 * rôles, afin qu'aucun endpoint ne permette de contourner la hiérarchie.
 */
export default function checkUserManagementScope(
  source: IdSource,
  assignedRoleIdsKey?: string,
) {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.auth) return res.status(401).json({ message: "Session absente" });

      const actorRank = Math.min(
        ...req.auth.userRoles.map(({ rank }) => rank),
        4,
      );
      const ids = getIds(req, source);

      // Les validateurs de la route produiront le message de format détaillé.
      if (
        ids.length === 0 ||
        ids.some((id) => !/^[a-f\d]{24}$/i.test(id))
      ) {
        return next();
      }

      const targets = await User.find({ _id: { $in: ids } }).populate("roles");
      const forbiddenTarget = targets.some((target) => {
        const targetRank = Math.min(
          ...(target.roles as any[]).map(({ rank }) => rank),
          4,
        );
        return targetRank <= actorRank;
      });

      if (forbiddenTarget) {
        return res.status(403).json({
          message:
            "Vous ne pouvez modifier ou supprimer qu'un utilisateur de rang inférieur au vôtre.",
        });
      }

      if (assignedRoleIdsKey) {
        const roleIds = Array.isArray(req.body?.[assignedRoleIdsKey])
          ? req.body[assignedRoleIdsKey]
          : [];
        if (roleIds.every((id: unknown) => typeof id === "string")) {
          if (roleIds.some((id: string) => !/^[a-f\d]{24}$/i.test(id))) {
            return next();
          }
          const roles = await Role.find({ _id: { $in: roleIds } }).select("rank");
          if (roles.some(({ rank }) => rank <= actorRank)) {
            return res.status(403).json({
              message:
                "Vous ne pouvez attribuer qu'un rôle de rang inférieur au vôtre.",
            });
          }
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

function getIds(req: CustomRequest, source: IdSource): string[] {
  const value = req[source.location]?.[source.key];
  if (source.location === "query") {
    return typeof value === "string" ? value.split(",").filter(Boolean) : [];
  }
  if (source.multiple) return Array.isArray(value) ? value.map(String) : [];
  return typeof value === "string" ? [value] : [];
}
