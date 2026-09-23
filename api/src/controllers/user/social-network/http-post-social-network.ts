import { type Response } from "express";
import createSocialNetwork from "../../../models/user/social-network/create-social-network.ts";
import type CustomRequest from "../../../utils/interfaces/express/custom-request.ts";

export default async function httpPostSocialNetwork(
  req: CustomRequest,
  res: Response
) {
  const { url } = req.body;

  try {
    const hobby = await createSocialNetwork(req.auth!.userId, url);
    return res
      .status(201)
      .json({ message: "Réseau social créé avec succès", data: hobby });
  } catch (error) {
    if ((error as { statusCode?: number }).statusCode === 404) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }
    return res.status(500).json({ message: "erreur serveur" });
  }
}
