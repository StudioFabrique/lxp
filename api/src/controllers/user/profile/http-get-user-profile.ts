import { Response } from "express";
import CustomRequest from "../../../utils/interfaces/express/custom-request";
import User from "../../../utils/interfaces/db/user";
import { serverIssue } from "../../../utils/constantes";

export default async function httpGetUserProfileInformation(
  req: CustomRequest,
  res: Response
) {
  try {
    const userId = req.auth?.userId;

    const user = await User.findById(userId)
      .select(
        "firstname lastname nickname email address city postCode phoneNumber description graduations hobbies links"
      )
      .populate(["hobbies", "links"]);

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
