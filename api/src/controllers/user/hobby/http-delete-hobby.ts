import { type Request, type Response } from "express";
import { serverIssue } from "../../../utils/constantes.ts";
import DeleteHobby from "../../../models/user/hobby/delete-hobby.ts";

export default async function httpDeleteHobby(req: Request, res: Response) {
  try {
    const id: string = req.params.id;

    await DeleteHobby(id);

    return res
      .status(200)
      .json({ message: "Suppression effectuée avec succès" });
  } catch (error) {

    return res.status(500).json({ message: serverIssue });
  }
}
