import { Request, Response } from "express";
import BlackListedToken from "../../utils/interfaces/db/blacklisted-token";

async function httpLogout(req: Request, res: Response) {
  const { accessToken, refreshToken } = req.cookies;

  const tokensToBlacklist = [accessToken, refreshToken]
    .filter(Boolean)
    .map((token) => ({ token }));

  if (tokensToBlacklist.length > 0) {
    try {
      await BlackListedToken.insertMany(tokensToBlacklist, { ordered: false });
    } catch (error) {
      console.error("Error creating blacklisted tokens:", error);
    }
  }

  return res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .status(200)
    .json({ message: "Déconnecté(e)." });
}

export default httpLogout;
