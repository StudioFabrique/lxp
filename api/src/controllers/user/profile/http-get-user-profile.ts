import { type Response } from "express";
import type CustomRequest from "../../../utils/interfaces/express/custom-request.ts";
import { serverIssue } from "../../../utils/constantes.ts";
import getUserProfile from "../../../models/user/get-user-profile.ts";

export default async function httpGetUserProfileInformation(
  req: CustomRequest,
  res: Response
) {
  try {
    const userId = req.auth?.userId;

    const user = await getUserProfile(userId);

    if (!user) {
      return res.status(400).json({
        message: "erreur lors de la récupération de l'utilisateur connecté",
      });
    }

    return res
      .status(200)
      .json({ message: "utilisateur récupéré", data: user });
  } catch (error) {
    return res.status(500).json({
      message: serverIssue,
    });
  }
}
