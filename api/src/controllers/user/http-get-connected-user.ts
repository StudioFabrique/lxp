import { Response } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import User from "../../utils/interfaces/db/user";

export default async function httpGetConnectedUser(
  req: CustomRequest,
  res: Response
) {
  const userId = req.auth?.userId;

  const response = await User.findById(userId, { password: 0 });

  if (!response) {
    return res.status(400).json({
      message: "erreur lors de la récupération de l'utilisateur connecté",
    });
  }

  return res
    .status(200)
    .json({ message: "utilisateur récupéré", data: response });
}
