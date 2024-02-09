import { Response } from "express";
import ConnectionInfos from "../../utils/interfaces/db/connection-infos";
import User from "../../utils/interfaces/db/user";
import CustomRequest from "../../utils/interfaces/express/custom-request";

export default async function httpGetDisconnect(
  req: CustomRequest,
  res: Response
) {
  const user = await User.findOne({ _id: req.auth?.userId }).populate("roles");

  if (user && user.roles[0].rank > 2) {
    const connInfos = await ConnectionInfos.findOne({
      _id: user.connectionInfos![user.connectionInfos!.length - 1],
    });
    if (connInfos) {
      const now = new Date().getTime();
      const duration =
        connInfos.totalConnTime + (now - connInfos!.lastConnection.getTime());
      await ConnectionInfos.findOneAndUpdate(
        { _id: connInfos._id },
        { totalConnTime: duration },
        { new: true }
      );
    }
  }
  return res.status(200).json({ message: "Déconnecté(e)." });
}
