import { Request, Response } from "express";
import getManyModules from "../../models/module/get-many-modules";

export default async function httpGetAllModules(req: Request, res: Response) {
  const { modulesId } = req.body;

  const response = getManyModules(modulesId);

  if (!response) {
    return res.status(404).send();
  }

  return res.status(200).send({ modules: response });
}
