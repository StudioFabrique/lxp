import jwt, { SignOptions } from "jsonwebtoken";
import { IRole } from "../../interfaces/db/role";
import BlackListedToken from "../../interfaces/db/blacklisted-token";

export const JWT_PATTERN =
  /^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/;

export function setTokens(
  userId: string,
  userRoles: Array<IRole>,
  expiresIn: SignOptions["expiresIn"] = "20m",
) {
  return jwt.sign({ userId, userRoles }, process.env.SECRET!, { expiresIn });
}

export async function isTokenBlacklisted(token: unknown) {
  if (!token || typeof token !== "string" || !JWT_PATTERN.test(token))
    return false;

  const blacklisted = await BlackListedToken.findOne({ token });
  return !!blacklisted;
}

export async function letsBlackListAToken(token: string) {
  if (!token || typeof token !== "string" || !JWT_PATTERN.test(token)) return;
  await BlackListedToken.create({ token });
}
