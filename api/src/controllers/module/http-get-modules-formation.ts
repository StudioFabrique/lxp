import { Request, Response } from "express";
import getModulesFormation from "../../models/module/get-modules-formation";

async function httpGetModuleFormation(req: Request, res: Response) {
  try {
    const formationId = Number(req.params.formationId);
    return res.status(200).json(await getModulesFormation(formationId));
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export default httpGetModuleFormation;
