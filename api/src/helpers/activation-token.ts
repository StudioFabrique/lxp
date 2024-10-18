import jwt from "jsonwebtoken";
import { IRole } from "../utils/interfaces/db/role";

export const activationToken = (userId: string, role: IRole) => {
  // création d'un token contenant l'id et le rôle de l'utilisateur
  const token = jwt.sign(
    { userId: userId, userRoles: [role] },
    process.env.REGISTER_SECRET!,
    {
      expiresIn: "7d",
    },
  );
  return token;
};
