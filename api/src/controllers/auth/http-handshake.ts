import { Response } from "express";

import User from "../../utils/interfaces/db/user/user.model";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { noAccess, serverIssue } from "../../utils/constantes";
import Student from "../../utils/interfaces/db/student/student.model";
import { IRole } from "../../utils/interfaces/db/role";
import { hasRole } from "../../utils/services/permissions/hasRole";

async function httpHandshake(req: CustomRequest, res: Response) {
  if (req.auth && req.auth.userId !== null) {
    try {
      const user = await _getUser(
        new Object(req.auth.userId),
        req.auth.userRoles
      );

      if (user && (hasRole(1, user.roles) || hasRole(2, user.roles))) {
        return res.status(200).json({
          id: user._id.toString(),
          email: user.email,
          roles: user.roles,
          avatar: user.avatar,
          createdAt: user.createdAt,
        });
      } else if (user && hasRole(3, user.roles)) {
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
    return await User.findOne({ _id: userId }).populate("roles", {
      _id: 1,
      role: 1,
      label: 1,
      rank: 1,
    });
  } else if (hasRole(3, roles)) {
    return await Student.findOne({ _id: userId }).populate("roles", {
      _id: 1,
      role: 1,
      label: 1,
      rank: 1,
    });
  }
  return false;
}

export default httpHandshake;
