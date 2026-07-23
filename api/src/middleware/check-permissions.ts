import { NextFunction, Response } from "express";
import CustomRequest from "../utils/interfaces/express/custom-request";
import {
  AppAction,
  AppSubject,
  appSubjects,
} from "../utils/rbac/ability";
import {
  authenticateSession,
  AuthenticationError,
} from "../utils/services/auth/authenticate-session";

const knownSubjects = new Set<string>(appSubjects);

function actionForMethod(method: string): AppAction | undefined {
  switch (method) {
    case "GET":
      return "read";
    case "POST":
      return "write";
    case "PATCH":
    case "PUT":
      return "update";
    case "DELETE":
      return "delete";
    default:
      return undefined;
  }
}

export default function checkPermissions(
  resource?: AppSubject,
  action?: Extract<AppAction, "read" | "write" | "update" | "delete">,
  failedRedirectPath?: string,
) {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const auth = await authenticateSession(
        req.cookies.accessToken,
        "access",
      );
      req.auth = auth;
      res.locals.roles = auth.userRoles;

      const dynamicSubject = resource ?? req.params.role;
      const resolvedAction = action ?? actionForMethod(req.method);

      if (
        !resolvedAction ||
        !dynamicSubject ||
        !knownSubjects.has(dynamicSubject) ||
        !auth.ability.can(resolvedAction, dynamicSubject as AppSubject)
      ) {
        if (failedRedirectPath) {
          return res.redirect(
            failedRedirectPath.replace("[:userId]", auth.userId),
          );
        }
        return res.status(403).json({
          message: "Vous n'êtes pas autorisé à accéder à cette ressource",
        });
      }

      next();
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return res.status(401).json({ message: "Session absente ou expirée" });
      }
      next(error);
    }
  };
}
