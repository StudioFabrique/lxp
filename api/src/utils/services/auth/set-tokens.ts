import jwt from "jsonwebtoken";
import { IRole } from "../../interfaces/db/role";

export function setTokens(userId: string, userRoles: Array<IRole>) {
  return jwt.sign({ userId, userRoles }, process.env.SECRET!);
}
