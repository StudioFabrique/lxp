import { Request, Response } from "express";
import { serverIssue } from "../../../utils/constantes";
import DeleteHobby from "../../../models/hobby/delete-hobby";

export default async function httpDeleteHobby(req: Request, res: Response) {
  try {
    const id: string = req.params.id;

    await DeleteHobby(id);

    return res
      .status(200)
      .json({ message: "suppression effectué avec succès" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: serverIssue });
  }
}
