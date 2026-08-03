import { Request, Response } from "express";
import { blacklistTokens } from "../../models/auth/session";

async function httpLogout(req: Request, res: Response) {
  const { accessToken, refreshToken } = req.cookies;

  try {
    await blacklistTokens([accessToken, refreshToken]);
  } catch (error) {
    console.error("Error creating blacklisted tokens:", error);
  }

  return res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .status(200)
    .json({ message: "Déconnecté(e)." });
}

export default httpLogout;
