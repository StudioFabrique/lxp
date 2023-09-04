import { Request, Response } from "express";
import deleteModule from "../../models/module/delete-module";

export default async function httpDeleteModule(req: Request, res: Response) {
  const { id } = req.params;

  const response = await deleteModule(parseInt(id));
  if (!response) {
    return res.status(500).send("problème serveur");
  }
  return res.status(200).send("ressource supprimé");
}
