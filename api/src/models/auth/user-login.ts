import bcrypt from "bcrypt";

import { credentialsError } from "../../utils/constantes";
import User from "../../utils/interfaces/db/user";
import IConnectionInfos from "../../utils/interfaces/db/connection-infos";
import ConnectionInfos from "../../utils/interfaces/db/connection-infos";

async function userLogin(email: string, password: string) {
  try {
    const user = await User.findOne({ email: email }).populate("roles");

    // on vérifie les identifiants et on retourne les informations de l'utilisateur
    if (
      user &&
      (await bcrypt.compare(password, user.password!)) &&
      user.isActive
    ) {
      if (user.roles[0].rank > 2) {
        if (user.connectionInfos!.length === 0) {
          console.log("new infos");
          const connInfos = new IConnectionInfos({
            lastConnection: new Date(),
          });
          const infos = await connInfos.save();
          await User.findOneAndUpdate(
            { _id: user._id },
            { connectionInfos: [new Object(infos._id)] }
          );
        } else {
          const existingInfos = await ConnectionInfos.findOne({
            _id: user.connectionInfos[user.connectionInfos.length - 1],
          });

          if (existingInfos) {
            console.log(existingInfos);

            const date = existingInfos?.lastConnection;
            const today = new Date();

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
              const tmp = [...user.connectionInfos, new Object(newInfos._id)];
              await User.findOneAndUpdate(
                { _id: user._id },
                { connectionInfos: tmp }
              );
            }
          }
        }
      }

      return {
        _id: user._id.toString(),
        email: user.email,
        roles: user.roles,
        avatar: user.avatar?.toString("base64"),
        createdAt: user.createdAt,
        firstname: user.firstname,
        lastname: user.lastname,
      };
    }
    throw { message: credentialsError, status: 401 };
  } catch (error: any) {
    throw error;
  }
}

export default userLogin;
