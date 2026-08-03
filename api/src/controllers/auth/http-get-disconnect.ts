import { type Response } from "express";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { closeCurrentConnection } from "../../models/auth/session.ts";

export default async function httpGetDisconnect(
  req: CustomRequest,
  res: Response
) {
  try {
    await closeCurrentConnection(req.auth?.userId);
    return res.status(200).json({ message: "Déconnecté(e)." });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      message: "Erreur lors de la déconnexion.",
    });
  }
}
