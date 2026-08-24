import jwt, { type SignOptions } from "jsonwebtoken";
import BlackListedToken from "../../interfaces/db/blacklisted-token.ts";
import type { SessionTokenType } from "./authenticate-session.ts";
import { env } from "../../../config/env.ts";

export const JWT_PATTERN =
  /^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/;

export function setTokens(
  userId: string,
  tokenType: SessionTokenType,
  expiresIn: SignOptions["expiresIn"] = "20m",
) {
  return jwt.sign({ userId, tokenType }, env.SECRET, { expiresIn });
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
