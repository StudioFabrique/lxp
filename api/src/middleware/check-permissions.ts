import { NextFunction, Response } from "express";
import CustomRequest from "../utils/interfaces/express/custom-request";
import jwt from "jsonwebtoken";
import { noAccess } from "../utils/constantes";
import { IRole } from "../utils/interfaces/db/role";
import Permission from "../utils/interfaces/db/permission";

function youShallNotPass() {
  console.log("vous ne passerez pas 🧙");
}

/**
 * Check le token et en même temps les roles de l'utilisateur connecté en fonction des permissions sur le serveur ainsi que du rang authorisé
 *
 * @param ressource (optionnel) La ressource sur laquelle l'action est effectué
 * @param action (optionnel) L'action à effectuer
 * @param failedRedirectPath (optionnel) la route de redirection API en cas d'echec
 * @returns
 */
export default function checkPermissions(
  ressource?: string,
  action?: "read" | "write" | "update" | "delete",
  failedRedirectPath?: string
) {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { role: roleFromParam } = req.params;

    if (!ressource && !roleFromParam)
      return res.status(400).json({
        message: "Requête invalide",
      });

    const authCookie = req.cookies.accessToken;

    if (!authCookie)
      return res.status(403).json({
        message: "Vous n'êtes pas autorisé à accéder à cette ressource",
      });

    let actionDefined: string | undefined = action;

    if (!actionDefined)
      switch (req.method) {
        case "GET":
          actionDefined = "read";
          break;
        case "POST":
          actionDefined = "write";
          break;
        case "PUT" || "PATCH":
          actionDefined = "update";
          break;
        case "DELETE":
          actionDefined = "delete";
          break;
        default:
          break;
      }

    if (!actionDefined)
      return res.status(403).json({
        message: "Vous n'êtes pas autorisé à accéder à cette ressource",
      });

    jwt.verify(authCookie, process.env.SECRET!, async (err: any, data: any) => {
      if (err) {
        return res.status(403).json({ message: noAccess });
      }

      const rolesToCheck: Array<IRole> = data.userRoles;

      res.locals.roles = rolesToCheck;

      let isRolesCorrect: boolean = false;

      /**
       * Parcours tous les rôles de l'utilisateur actuel et si au moins l'un des roles est correct, renvoie true
       */

      for (const role of rolesToCheck) {
        const authorization =
          !ressource && roleFromParam
            ? await _authorizeThisRole(role, actionDefined!, roleFromParam)
            : await authorizeThisRole(role, actionDefined!, ressource!);

        if (authorization) {
          isRolesCorrect = true;
        }
      }

      if (isRolesCorrect) {
        req.auth = { userId: data.userId, userRoles: data.userRoles };
        next();
      } else {
        if (failedRedirectPath)
          res.redirect(failedRedirectPath.replace("[:userId]", data.userId));
        else
          return res.status(403).json({
            message: "Vous n'êtes pas autorisé à accéder à cette ressource",
          });
      }
    });
  };
}

async function authorizeThisRole(
  role: IRole,
  action: string,
  ressource: string
): Promise<boolean> {
  const permissionFound = await Permission.findOne({
    role: role.role,
    action: action,
  });

  if (permissionFound && permissionFound.ressources.includes(ressource)) {
    return true;
  }
  youShallNotPass();
  return false;
}

async function _authorizeThisRole(
  role: IRole,
  action: string,
  roleFromParam: string
): Promise<boolean> {
  const permissionFound = await Permission.findOne({
    role: role.role,
    action: action,
  });

  if (permissionFound && permissionFound.ressources.includes(roleFromParam)) {
    return true;
  }
  youShallNotPass();
  return false;
}
