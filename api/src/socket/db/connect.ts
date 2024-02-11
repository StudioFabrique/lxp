import User from "../../utils/interfaces/db/user";
import IUserSocket from "../../utils/interfaces/db/user-socket";
import IConnectionInfos from "../../utils/interfaces/db/connection-infos";
import ConnectionInfos from "../../utils/interfaces/db/connection-infos";
import UserSocket from "../../utils/interfaces/db/user-socket";

export default async function connect(socketId: string, userId: string) {
  try {
    const existingUser = await User.findOne({ _id: userId }).populate("roles");
    if (existingUser && existingUser.isActive) {
      const existingSocket = await UserSocket.findOne({ userId });
      if (existingSocket) {
        await UserSocket.deleteOne({ _id: existingSocket._id });
      }
      const socket = new IUserSocket({
        socketId,
        userId: existingUser._id,
        rank: existingUser.roles[0].rank,
      });
      await socket.save();
      if (existingUser.roles[0].rank > 2) {
        if (existingUser.connectionInfos.length === 0) {
          const infos = new IConnectionInfos({});
          const newInfos = await infos.save();
          await User.findOneAndUpdate(
            { _id: userId },
            { connectionInfos: [new Object(newInfos._id)] }
          );
        } else {
          const existingInfos = await ConnectionInfos.findOne({
            _id: existingUser.connectionInfos[
              existingUser.connectionInfos.length - 1
            ],
          });
          if (existingInfos) {
            if (
              existingInfos &&
              existingInfos.lastConnection.getDate() === new Date().getDate() &&
              existingInfos.lastConnection.getMonth() ===
                new Date().getMonth() &&
              existingInfos.lastConnection.getFullYear() ===
                new Date().getFullYear()
            ) {
              // If existing connectionInfos is created today, update lastConnection
              await ConnectionInfos.findOneAndUpdate(
                { _id: existingInfos._id },
                { lastConnection: new Date() },
                { new: true }
              );
            } else {
              const newInfos = new IConnectionInfos({});
              const savedNewInfos = await newInfos.save();
              const tmp = [
                ...existingUser.connectionInfos,
                new Object(savedNewInfos._id),
              ];
              await User.findOneAndUpdate(
                { _id: existingUser._id },
                { connectionInfos: tmp }
              );
            }
          }
        }
      }
    }
  } catch (error: any) {
    console.log(error);
    return;
  }
}
