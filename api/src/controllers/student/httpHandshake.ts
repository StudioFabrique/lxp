import { Response } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { noAccess, serverIssue } from "../../utils/constantes";
import Student from "../../utils/interfaces/db/student/student.model";

async function httpHandshake(req: CustomRequest, res: Response) {
  if (req.auth && req.auth.userId !== null) {
    try {
      const user = await Student.findOne({ _id: new Object(req.auth.userId) });
      if (user && user.roles.includes("student")) {
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

export default httpHandshake;
