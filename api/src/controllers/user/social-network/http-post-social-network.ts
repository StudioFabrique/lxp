import { type Request, type Response } from "express";
import createSocialNetwork from "../../../models/user/social-network/create-social-network.ts";

export default async function httpPostSocialNetwork(
  req: Request,
  res: Response
) {
  const { id, url } = req.body;

  try {
    const hobby = await createSocialNetwork(id, url);
    return res
      .status(201)
      .json({ message: "Réseau social créé avec succès", data: hobby });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ message: error });
  }
}
