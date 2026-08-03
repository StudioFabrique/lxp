import { Response } from "express";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { closeCurrentConnection } from "../../models/auth/session";

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
