import jwt, { type SignOptions } from "jsonwebtoken";
import { type IRole } from "../utils/interfaces/db/role.ts";
import { env } from "../config/env.ts";

export const activationToken = (
  userId: string,
  role: IRole,
  expire: SignOptions["expiresIn"],
) => {
  // création d'un token contenant l'id et le rôle de l'utilisateur
  const token = jwt.sign(
    { userId: userId, userRoles: [role] },
    env.REGISTER_SECRET,
    {
      expiresIn: expire,
    },
  );
  return token;
};
