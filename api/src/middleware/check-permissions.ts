import { NextFunction, Response } from "express";
import CustomRequest from "../utils/interfaces/express/custom-request";
import jwt from "jsonwebtoken";
import { noAccess } from "../utils/constantes";
import { IRole } from "../utils/interfaces/db/role";
import Permission from "../utils/interfaces/db/permission";

/**
 * Check le token et en même temps les roles de l'utilisateur connecté en fonction des permissions sur le serveur ainsi que du rang authorisé
 *
 * @param action L'action a effectuer
 * @param ressource La ressource sur laquelle l'action est effectué
 * @returns
 */
export default function checkPermissions(ressource?: string, action?: string) {
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

    console.log(req.method);

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

      console.log("les données :");

      console.log(data);

      const rolesToCheck: Array<IRole> = data.userRoles;

      let isRolesCorrect: boolean = false;

      console.log(rolesToCheck.length);

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
        console.log("le role est correct ! passage accordé");
        req.auth = { userId: data.userId, userRoles: data.userRoles };
        next();
      } else {
        console.log("le role n'est pas correct !");
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
  console.log("vérification rang passé");

  const permissionFound = await Permission.findOne({
    role: role.role,
    action: action,
  });

  console.log("permission trouvé sur la base de données :");
  console.log(permissionFound);

  if (permissionFound && permissionFound.ressources.includes(ressource)) {
    return true;
  }
  console.log("vous ne passerez pas 🧙");

  return false;
}

async function _authorizeThisRole(
  role: IRole,
  action: string,
  roleFromParam: string
): Promise<boolean> {
  console.log("vérification rang passé");

  const permissionFound = await Permission.findOne({
    role: role.role,
    action: action,
  });

  console.log("permission trouvé sur la base de données :");
  console.log(permissionFound);

  if (permissionFound && permissionFound.ressources.includes(roleFromParam)) {
    return true;
  }
  console.log("vous ne passerez pas 🧙");

  return false;
}
