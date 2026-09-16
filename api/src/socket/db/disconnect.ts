import { regexGeneric } from "../../utils/constantes.ts";
import ConnectionInfos from "../../utils/interfaces/db/connection-infos.ts";
import User from "../../utils/interfaces/db/user.ts";
import UserSocket from "../../utils/interfaces/db/user-socket.ts";

export default async function disconnect(socketId: string) {
  const existingSocket = await UserSocket.findOne({ socketId });
  if (existingSocket) {
    const user = await User.findOne({ _id: existingSocket?.userId });
    if (user) {
      // on vérifie que l'user est un apprenant
      if (existingSocket.rank > 2) {
        const connectionInfos = user.connectionInfos ?? [];
        const connInfos =
          connectionInfos.length > 0
            ? await ConnectionInfos.findOne({
                _id: connectionInfos[connectionInfos.length - 1],
              })
            : null;
        if (connInfos) {
          // on incrémente la propriété duration avec le nouveau temps de connexion total pour la journée en cours
          const now = new Date().getTime();
          const duration =
            connInfos.duration + (now - connInfos!.lastConnection.getTime());
          await ConnectionInfos.findOneAndUpdate(
            { _id: connInfos._id },
            { duration: duration },
            { returnDocument: "after" },
          );
        }
      }
      await UserSocket.deleteOne({ socketId });
    }
  }
}
