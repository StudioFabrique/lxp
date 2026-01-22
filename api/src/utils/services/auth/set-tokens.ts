import jwt, { SignOptions } from "jsonwebtoken";
import { IRole } from "../../interfaces/db/role";

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

  const BlackListedToken =
    await import("../../interfaces/db/blacklisted-token");
  const blacklisted = await BlackListedToken.default.findOne({ token });
  return !!blacklisted;
}

export async function letsBlackListAToken(token: string) {
  if (!token || typeof token !== "string" || !JWT_PATTERN.test(token)) return;
  const BlackListedToken =
    await import("../../interfaces/db/blacklisted-token");
  await BlackListedToken.default.create({ token });
}
