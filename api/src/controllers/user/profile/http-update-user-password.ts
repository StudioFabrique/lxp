import { Request, Response } from "express";
import updateUserPassword from "../../../models/user/update-user-password";

export default async function httpUpdateUserPassword(
  req: Request,
  res: Response
) {
  const { id, oldPass, newPass } = req.body;

  try {
    const response = await updateUserPassword(id, oldPass, newPass);

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
