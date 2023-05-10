import { Response } from "express";

import User from "../../utils/interfaces/db/teacher-admin/teacher.model";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { noAccess, serverIssue } from "../../utils/constantes";
import Student from "../../utils/interfaces/db/student/student.model";
import { validationResult } from "express-validator";
import { IRole } from "../../utils/interfaces/db/role";
import { hasRole } from "../../utils/services/permissions/hasRole";

async function httpHandshake(req: CustomRequest, res: Response) {
  console.log("coucou");

  if (req.auth && req.auth.userId !== null) {
    try {
      const user = await _getUser(
        new Object(req.auth.userId),
        req.auth.userRoles
      );
      console.log(req.auth);

      console.log(user);

      if (
        user &&
        (user.roles.includes("admin") || user.roles.includes("teacher"))
      ) {
        return res.status(200).json({
          id: user._id.toString(),
          email: user.email,
          roles: user.roles,
          avatar: user.avatar,
          createdAt: user.createdAt,
        });
      } else if (user && user.roles.includes("student")) {
        return res.status(200).json({
          id: user._id.toString(),
          email: user.email,
          roles: user.roles,
          avatar: user.avatar,
          createdAt: user.createdAt,
        });
      }
      return res.status(403).json({ message: noAccess });
    } catch (err) {
      return res.status(500).json({ message: serverIssue + err });
    }
  }
}

/** on récupère les infos de l'utilisateur en fonction de son rôle */
async function _getUser(userId: Object, roles: Array<IRole>) {
  if (hasRole(1, roles) || hasRole(2, roles)) {
    return await User.findOne({ _id: userId });
  } else if (hasRole(3, roles)) {
    return await Student.findOne({ _id: userId });
  }
  return false;
}

export default httpHandshake;
