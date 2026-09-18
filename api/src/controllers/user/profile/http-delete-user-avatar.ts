import { type Response } from "express";
import { deleteUserAvatar } from "../../../models/user/update-user-avatar.ts";
import type CustomRequest from "../../../utils/interfaces/express/custom-request.ts";
import { serverIssue } from "../../../utils/constantes.ts";

export default async function httpDeleteUserAvatar(
  req: CustomRequest,
  res: Response,
) {
  const userId = req.auth?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Utilisateur non authentifié." });
  }

  try {
    const result = await deleteUserAvatar(userId);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    return res.status(200).json({ message: "Photo de profil supprimée." });
  } catch {
    return res.status(500).json({ message: serverIssue });
  }
}
