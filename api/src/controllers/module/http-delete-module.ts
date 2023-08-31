import { Request, Response } from "express";
import deleteModule from "../../models/module/delete-module";

export default async function httpDeleteModule(req: Request, res: Response) {
  const { module, moduleId } = req.body;

  const response = await deleteModule({ ...module }, moduleId);
  if (!response) {
    return res.status(500).send("problème serveur");
  }
  return res.status(200).send("ressource supprimé");
}
