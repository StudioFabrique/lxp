import { type Request, type Response } from "express";
import { serverIssue } from "../../../utils/constantes.ts";
import deleteSocialNetwork from "../../../models/user/social-network/delete-social-network.ts";

export default async function httpDeleteSocialNetwork(
  req: Request,
  res: Response
) {
  try {
    const id: string = req.params.id;

    await deleteSocialNetwork(id);

    return res
      .status(200)
      .json({ message: "Suppression effectuée avec succès" });
  } catch (error) {

    return res.status(500).json({ message: serverIssue });
  }
}
