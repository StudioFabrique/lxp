import { Response } from "express";
import { badQuery } from "../../utils/constantes";
import deleteUser from "../../models/user/delete-user";
import CustomRequest from "../../utils/interfaces/express/custom-request";

export default async function httpDeleteUser(
  req: CustomRequest,
  res: Response,
) {
  const { id } = req.params;

  const userId = req.auth?.userId;

  if (!id || !userId) {
    return res.status(400).json({ message: badQuery });
  }

  try {
    await deleteUser(id, userId);

    return res
      .status(201)
      .json({ message: "L'utilisateur a été supprimé avec succès" });
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
}
