import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import putAddModule from "../../models/parcours/put-add-module";

async function httpPutAddModule(req: Request, res: Response) {
  const { moduleId, parcoursId } = req.params;

  try {
    const response = await putAddModule(+moduleId, +parcoursId);

    return res.status(201).json(response);
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}

export default httpPutAddModule;
