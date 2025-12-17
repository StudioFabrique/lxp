import { NextFunction, Response } from "express";
import CustomRequest from "../utils/interfaces/express/custom-request";
import jwt from "jsonwebtoken";
import { noAccess, serverIssue } from "../utils/constantes";
import { IRole } from "../utils/interfaces/db/role";
import Permission from "../utils/interfaces/db/permission";
import BlackListedToken from "../utils/interfaces/db/blacklisted-token";

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
  failedRedirectPath?: string,
) {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { role: roleFromParam } = req.params;

    if (!ressource && !roleFromParam)
      return res.status(400).json({
        message: "Requête invalide",
      });

    const authCookie = req.cookies.accessToken;

    let blacklistedToken;
    if (authCookie) {
      blacklistedToken = await BlackListedToken.findOne({
        token: authCookie,
      });
    }

    if (!authCookie || blacklistedToken)
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
        // merge the both cases
        case "PATCH":
        case "PUT":
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
        try {
          await BlackListedToken.create({
            token: authCookie,
          });
        } catch (error) {
          console.error({ error });
        }
        return res.status(403).json({ message: noAccess });
      }

      const rolesToCheck: Array<IRole> = data.userRoles;

      res.locals.roles = rolesToCheck;

      let allPermissions: any;

      try {
        allPermissions = await Promise.all(
          rolesToCheck.map((role) =>
            Permission.find({
              roles: role._id,
            }),
          ),
        );
      } catch (error) {
        console.log({ error });
        youShallNotPass();
        return res.status(500).json({
          message: serverIssue,
        });
      }

      const flattenedPermissions = allPermissions.flat();

      const requiredPermissionName = `${actionDefined!}:${
        !ressource && roleFromParam ? roleFromParam : ressource!
      }`;
      const hasPermission = flattenedPermissions.some(
        (permission: any) => permission.name === requiredPermissionName,
      );

      if (hasPermission) {
        req.auth = { userId: data.userId, userRoles: data.userRoles };
        next();
      } else {
        youShallNotPass();
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

/* async function _authorizeThisRole(
  role: IRole,
  action: string,
  ressource: string,
): Promise<boolean> {
  console.log({ role, action, ressource });

  // Check all permissions for the role
  const permissions = await Permission.find({
    roles: role._id,
  });

  // Check if any permission matches the required action and resource
  const hasRequiredPermission = permissions.some(
    (permission) => permission.name === `${action}:${ressource}`,
  );

  if (hasRequiredPermission) {
    return true;
  }
  youShallNotPass();
  return false;
} */
