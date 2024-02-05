import { Request, Response } from "express";
import updateUserPassword from "../../../models/user/update-user-password";
import CustomRequest from "../../../utils/interfaces/express/custom-request";

export default async function httpUpdateUserPassword(
  req: CustomRequest,
  res: Response
) {
  const { oldPass, newPass } = req.body;

  const id = req.auth?.userId;

  try {
    const response = id ? await updateUserPassword(id, oldPass, newPass) : null;

    if (!response) {
      return res.status(404).json({ message: "non trouvé" });
    }

    return res
      .status(201)
      .json({ message: "utilisateur mis à jour avec succès", data: response });
  } catch (error) {
    return res.status(500).json({ message: "erreur serveur" });
  }
}
