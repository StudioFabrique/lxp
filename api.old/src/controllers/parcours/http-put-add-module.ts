import { Response } from "express";
import { serverIssue } from "../../utils/constantes";
import putAddModule from "../../models/parcours/put-add-module";
import CustomRequest from "../../utils/interfaces/express/custom-request";

async function httpPutAddModule(req: CustomRequest, res: Response) {
  const { moduleId, parcoursId } = req.params;
  const userId = req.auth?.userId;
  try {
    const response = await putAddModule(+moduleId, +parcoursId, userId!);
    const result = { ...response, thumb: response.thumb.toString("base64") };
    return res.status(201).json(result);
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}

export default httpPutAddModule;
