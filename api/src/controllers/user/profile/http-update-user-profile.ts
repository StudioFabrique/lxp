import { Response } from "express";
import { IUser } from "../../../utils/interfaces/db/user";
import updateUser from "../../../models/user/update-user";
import CustomRequest from "../../../utils/interfaces/express/custom-request";

export default async function httpUpdateUserProfile(
  req: CustomRequest,
  res: Response
) {
  const id = req.auth?.userId;

  if (!id) {
    return res.status(404).json({ message: "non trouvé" });
  }

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
