import bcrypt from "bcrypt";

import User from "../../utils/interfaces/db/teacher-admin/teacher.model";

async function userLogin(email: string, password: string) {
  const user = await User.findOne({ email: email });

  // on vérifie les identifiants et on retourne les informations de l'utilisateur
  if (user && (await bcrypt.compare(password, user.password))) {
    if (user.roles.includes("admin") || user.roles.includes("teacher")) {
      return {
        id: user._id.toString(),
        email: user.email,
        roles: user.roles,
        avatar: user.avatar,
        createdAt: user.createdAt,
      };
    }
  }
  return false;
}

export default userLogin;
