import { Request, Response } from "express";
import createModule from "../../models/module/create-module";

export default async function httpCreateModule(req: Request, res: Response) {
  const { module, parcoursId /* imageFile */ } = req.body;

  const response = await createModule({ ...module /* image */ }, parcoursId);
  if (!response) {
    return res.status(500).send("problème serveur");
  }
  return res.status(201).send("ressource créée");
}
