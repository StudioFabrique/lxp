import { type Response } from "express";
import getModulesFormation from "../../models/module/get-modules-formation.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { resolveAccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

async function httpGetModuleFormation(req: CustomRequest, res: Response) {
  try {
    const formationId = Number(req.params.formationId);
    return res.status(200).json(
      await getModulesFormation(
        formationId,
        await resolveAccessScope(req.auth!),
      ),
    );
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export default httpGetModuleFormation;
