import { Request, Response } from "express";
import createModule from "../../models/module/create-module";

export default async function httpCreateModules(req: Request, res: Response) {
  const { module, parcoursId } = req.body;
  const response = createModule(module, parcoursId);
  if (!response) {
    return res.status(500).send("problème serveur");
  }
  return res.status(201).send("ressource créée");
}
