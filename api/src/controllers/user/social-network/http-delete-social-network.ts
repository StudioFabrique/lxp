import { type Response } from "express";
import { serverIssue } from "../../../utils/constantes.ts";
import deleteSocialNetwork from "../../../models/user/social-network/delete-social-network.ts";
import type CustomRequest from "../../../utils/interfaces/express/custom-request.ts";

export default async function httpDeleteSocialNetwork(
  req: CustomRequest<{ id: string }>,
  res: Response,
) {
  try {
    const id: string = req.params.id;

    const deleted = await deleteSocialNetwork(id, req.auth!.userId);
    if (!deleted) return res.status(404).json({ message: "Réseau social introuvable" });

    return res
      .status(200)
      .json({ message: "Suppression effectuée avec succès" });
  } catch (error) {
    return res.status(500).json({ message: serverIssue });
  }
}
