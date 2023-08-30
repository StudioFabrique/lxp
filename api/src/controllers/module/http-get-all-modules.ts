import { Request, Response } from "express";
import getManyModules from "../../models/module/get-many-modules";

export default async function httpGetAllModules(req: Request, res: Response) {
  const { parcoursId } = req.params;

  const response = await getManyModules(parseInt(parcoursId));

  if (!response) {
    return res.status(200).send({ message: "aucun modules" });
  }

  return res.status(200).send({ modules: response });
}
