import { Request, Response } from "express";
import putParcoursModules from "../../models/module/put-parcours-modules";

async function httpParcoursModules(req: Request, res: Response) {
  try {
    const parcoursId = +req.params.parcoursId;
    const modulesId = req.body;

    const result = await putParcoursModules(parcoursId, modulesId);

    return res.status(201).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

export default httpParcoursModules;
