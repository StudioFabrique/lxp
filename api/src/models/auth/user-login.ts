import bcrypt from "bcrypt";

import { credentialsError } from "../../utils/constantes";
import User from "../../utils/interfaces/db/user";

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
