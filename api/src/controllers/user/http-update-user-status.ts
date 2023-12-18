import { Request, Response } from "express";
import { badQuery, serverIssue } from "../../utils/constantes";
import updateUserStatus from "../../models/user/update-user-status";

async function httpUpdateUserStatus(req: Request, res: Response) {
  try {
    const user = req.body;
    const updatedUser = await updateUserStatus(user);
    if (!updatedUser) {
      return res.status(400).json({ message: badQuery });
    }
    return res
      .status(201)
      .json({ message: "Utilisateur mis à jour avec succès." });
  } catch (error) {
    return res.status(500).json({ message: serverIssue + error });
  }
}

export default httpUpdateUserStatus;
