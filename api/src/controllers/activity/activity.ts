import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";

export default async function httpPostActivity(req: Request, res: Response) {
  try {
    const { lessonId } = req.params;

    const { value, order, type } = req.body;

    let response: any = {};

    switch (type) {
      case "text":
        response.message = "texte incoming";
        break;
    }
    return res.status(201).json(response);
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
