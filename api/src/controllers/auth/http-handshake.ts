import { Response } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { noAccess, serverIssue } from "../../utils/constantes";
import getUser from "../../models/user/get-user";
import ConnectionInfos from "../../utils/interfaces/db/connection-infos";
import IConnectionInfos from "../../utils/interfaces/db/connection-infos";
import User from "../../utils/interfaces/db/user";

async function httpHandshake(req: CustomRequest, res: Response) {
  if (req.auth && req.auth.userId !== null) {
    try {
      const user = await getUser(new Object(req.auth.userId));

      if (user && user.isActive) {
        if (user.roles[0].rank > 2) {
          const connInfos = await ConnectionInfos.findOne({
            _id: user.connectionInfos![user.connectionInfos!.length - 1],
          });
          const date = connInfos?.lastConnection;
          const today = new Date();

          if (
            connInfos &&
            connInfos.lastConnection.getDate() === new Date().getDate() &&
            connInfos.lastConnection.getMonth() === new Date().getMonth() &&
            connInfos.lastConnection.getFullYear() === new Date().getFullYear()
          ) {
            // If existing connectionInfos is created today, update lastConnection
            await ConnectionInfos.findOneAndUpdate(
              { _id: connInfos._id },
              { lastConnection: new Date() },
              { new: true }
            );
          } else {
            const newInfos = new IConnectionInfos({});
            const tmp = [...user.connectionInfos, new Object(newInfos._id)];
            await User.findOneAndUpdate(
              { _id: user._id },
              { connectionInfos: tmp }
            );
          }
        }
        return res.status(200).json({
          _id: user._id.toString(),
          email: user.email,
          roles: user.roles,
          avatar: user.avatar?.toString("base64"),
          createdAt: user.createdAt,
          firstname: user.firstname,
          lastname: user.lastname,
        });
      }
      return res.status(403).json({ message: noAccess });
    } catch (err) {
      return res.status(500).json({ message: serverIssue });
    }
  }
}

export default httpHandshake;
