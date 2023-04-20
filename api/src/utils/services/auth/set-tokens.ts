import jwt from "jsonwebtoken";

export function setTokens(userId: string, userRoles: Array<string>) {
  return jwt.sign({ userId, userRoles }, process.env.SECRET!);
}
