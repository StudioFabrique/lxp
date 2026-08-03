import { type Request, type Response } from "express";
import createHobby from "../../../models/user/hobby/create-hobby.ts";

export default async function httpPostHobby(req: Request, res: Response) {
  const { id, title } = req.body;

  try {
    const hobby = await createHobby(id, title);
    return res
      .status(201)
      .json({ message: "Hobby créé avec succès", data: hobby });
  } catch (error) {
    return res.status(500).json({ message: "erreur serveur" });
  }
}
