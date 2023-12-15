import { Request, Response } from "express";
import { IUser } from "../../../utils/interfaces/db/user";
import updateUser from "../../../models/user/update-user";

export default async function httpUpdateUserProfile(
  req: Request,
  res: Response
) {
  const { id } = req.params;
  const { user }: { user: IUser } = req.body;

  try {
    const response = await updateUser(id, user);

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
