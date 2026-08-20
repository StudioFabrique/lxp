import { type Request, type Response } from "express";
import { blacklistTokens } from "../../models/auth/session.ts";
import { clearedCookieOptions } from "../../config/config.ts";

async function httpLogout(req: Request, res: Response) {
  const { accessToken, refreshToken } = req.cookies;

  try {
    await blacklistTokens([accessToken, refreshToken]);
  } catch (error) {
    console.error("Error creating blacklisted tokens:", error);
  }

  return res
    .clearCookie("accessToken", clearedCookieOptions())
    .clearCookie("refreshToken", clearedCookieOptions())
    .status(200)
    .json({ message: "Déconnecté(e)." });
}

export default httpLogout;
