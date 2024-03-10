import User from "../../utils/interfaces/db/user";
import UserSocket from "../../utils/interfaces/db/user-socket";
import ConnectionInfos from "../../utils/interfaces/db/connection-infos";
import IConnectionInfos from "../../utils/interfaces/db/connection-infos";

export default async function connect(socketId: string, userId: string) {
  try {
    const existingUser = await User.findOne({
      _id: userId,
      isActive: true,
    }).populate("roles");

    if (!existingUser) {
      throw new Error("L'utilisateur n'existe pas ou est inactif.");
    }

    // Remove existing socket
    await UserSocket.deleteOne({ userId });

    // Create new socket
    await UserSocket.create({
      socketId,
      userId: existingUser._id,
      rank: existingUser.roles[0].rank,
    });

    if (existingUser.roles[0].rank > 2) {
      if (existingUser.connectionInfos.length > 0) {
        const lastConnectionInfos = await ConnectionInfos.findOne({
          _id: existingUser.connectionInfos[
            existingUser.connectionInfos.length - 1
          ],
        });

        if (lastConnectionInfos) {
          const today = new Date();
          console.log(
            today.getDate() === lastConnectionInfos.lastConnection.getDate()
          );

          if (
            lastConnectionInfos &&
            today.getDate() === lastConnectionInfos.lastConnection.getDate() &&
            today.getMonth() ===
              lastConnectionInfos.lastConnection.getMonth() &&
            today.getFullYear() ===
              lastConnectionInfos.lastConnection.getFullYear()
          ) {
            // Update existing connection infos
            await lastConnectionInfos.updateOne({ lastConnection: today });
          } else {
            // Create new connection infos
            const newInfos = new IConnectionInfos({
              userId,
              lastConnection: new Date(),
            });
            const infos = await newInfos.save();
            await User.findOneAndUpdate(
              { _id: userId },
              { $push: { connectionInfos: infos._id } }
            );
          }
        }
      } else {
        // Create new connection infos
        const newInfos = new IConnectionInfos({
          userId,
          lastConnection: new Date(),
        });
        const infos = await newInfos.save();
        await User.findOneAndUpdate(
          { _id: userId },
          { $push: { connectionInfos: infos._id } }
        );
      }
    }
  } catch (error: any) {
    throw error;
  }
}
