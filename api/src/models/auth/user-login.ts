import bcrypt from "bcrypt";

import { hasRole } from "../../utils/services/permissions/hasRole";
import User from "../../utils/interfaces/db/user.model";
import { credentialsError } from "../../utils/constantes";

async function userLogin(email: string, password: string) {
  try {
    const user = await User.findOne({ email: email }).populate("roles");

    // on vérifie les identifiants et on retourne les informations de l'utilisateur
    if (
      user &&
      (await bcrypt.compare(password, user.password!)) &&
      user.isActive
    ) {
      return {
        id: user._id.toString(),
        email: user.email,
        roles: user.roles,
        avatar: user.avatar,
        createdAt: user.createdAt,
      };
    }
    throw { message: credentialsError, status: 401 };
  } catch (error: any) {
    throw error;
  }
}

export default userLogin;
