import { Request, Response } from "express";
import { badQuery, serverIssue } from "../../utils/constantes";
import updateUserStatus from "../../models/user/update-user-status";

async function httpUpdateUserStatus(req: Request, res: Response) {
  try {
    const { userId, value } = req.body;
    const updatedUser = await updateUserStatus(userId, value);

    if (value !== true && value !== false) {
      throw { message: badQuery, satusCode: 400 };
    }

    return res
      .status(201)
      .json({ message: "Utilisateur mis à jour avec succès." });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}

export default httpUpdateUserStatus;
