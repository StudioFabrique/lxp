import { type Response } from "express";
import createHobby from "../../../models/user/hobby/create-hobby.ts";
import type CustomRequest from "../../../utils/interfaces/express/custom-request.ts";

export default async function httpPostHobby(req: CustomRequest, res: Response) {
  const { title } = req.body;

  try {
    const hobby = await createHobby(req.auth!.userId, title);
    return res
      .status(201)
      .json({ message: "Hobby créé avec succès", data: hobby });
  } catch (error) {
    if ((error as { statusCode?: number }).statusCode === 404) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }
    return res.status(500).json({ message: "erreur serveur" });
  }
}
