import bcrypt from "bcrypt";

import { credentialsError } from "../../utils/constantes.ts";
import User from "../../utils/interfaces/db/user.ts";
import IConnectionInfos from "../../utils/interfaces/db/connection-infos.ts";
import ConnectionInfos from "../../utils/interfaces/db/connection-infos.ts";
import { imageToDataUrl } from "../../utils/images/image-source.ts";

async function userLogin(email: string, password: string) {
  try {
    const user = await User.findOne({ email: email }).populate({
      path: "roles",
      select: "-permissions",
    });

    // Vérifiez si l'utilisateur existe ET s'il possède un mot de passe stocké
    if (!user || !user.password) {
      throw { message: credentialsError, status: 401 };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    // on vérifie les identifiants et on retourne les informations de l'utilisateur
    if (user && isPasswordValid && user.isActive) {
      return {
        _id: user._id.toString(),
        email: user.email,
        roles: user.roles,
        avatar: imageToDataUrl(user.avatar),
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
