import bcrypt from "bcrypt";

import User from "../../utils/interfaces/db/teacher-admin/teacher.model";
import { hasRole } from "../../utils/services/permissions/hasRole";

async function userLogin(email: string, password: string) {
  const user = await User.findOne({ email: email }).populate("roles", {
    _id: 1,
    role: 1,
    label: 1,
    rank: 1,
  });

  // on vérifie les identifiants et on retourne les informations de l'utilisateur
  if (user && (await bcrypt.compare(password, user.password))) {
    if (hasRole(1, user.roles) || hasRole(2, user.roles)) {
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
