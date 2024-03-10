import { regexGeneric } from "../../utils/constantes";
import ConnectionInfos from "../../utils/interfaces/db/connection-infos";
import User from "../../utils/interfaces/db/user";
import UserSocket from "../../utils/interfaces/db/user-socket";

export default async function disconnect(socketId: string) {
  console.log("hey");

  const existingSocket = await UserSocket.findOne({ socketId });
  if (existingSocket) {
    const user = await User.findOne({ _id: existingSocket?.userId });
    if (user) {
      // on vérifie que l'user est un apprenant
      if (existingSocket.rank > 2) {
        const connInfos = await ConnectionInfos.findOne({
          _id: user.connectionInfos![user.connectionInfos!.length - 1],
        });
        if (connInfos) {
          // on incrémente la propriété duration avec le nouveau temps de connexion total pour la journée en cours
          const now = new Date().getTime();
          const duration =
            connInfos.duration + (now - connInfos!.lastConnection.getTime());
          await ConnectionInfos.findOneAndUpdate(
            { _id: connInfos._id },
            { duration: duration },
            { new: true }
          );
        }
      }
      await UserSocket.deleteOne({ socketId });
    }
  }
}
