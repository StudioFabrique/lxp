import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";

import deleteModule from "../../models/module/delete-module";

async function httpDeleteModule(req: Request, res: Response) {
  const { moduleId } = req.params;

  try {
    const response = await deleteModule(+moduleId);
    return res.status(200).json(response);
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
}

export default httpDeleteModule;
