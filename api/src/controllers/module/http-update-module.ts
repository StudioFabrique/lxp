import { Request, Response } from "express";
import updateModule from "../../models/module/update-module";

export default async function httpUpdateModule(req: Request, res: Response) {
  const { module, moduleId /* imageFile */ } = req.body;

  const response = await updateModule({ ...module /* image */ }, moduleId);
  if (!response) {
    return res.status(500).send("problème serveur");
  }
  return res.status(201).send("ressource créée");
}
