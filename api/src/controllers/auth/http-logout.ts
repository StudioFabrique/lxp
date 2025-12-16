import { Request, Response } from "express";
import BlackListedToken from "../../utils/interfaces/db/blacklisted-token";

async function httpLogout(req: Request, res: Response) {
  const authCookie = req.cookies.accessToken;

  if (authCookie)
    try {
      await BlackListedToken.create({
        token: authCookie,
      });
    } catch (error) {
      console.error("Error creating blacklisted token:", error);
    }

  return res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .status(200)
    .json({ message: "Déconnecté(e)." });
}

export default httpLogout;
