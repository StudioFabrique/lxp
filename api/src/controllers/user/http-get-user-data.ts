import { type Request, type Response } from "express";
import { serverIssue } from "../../utils/constantes.ts";
import getUserData from "../../models/user/get-user-data.ts";
import { validationResult } from "express-validator";

export default async function httpGetUserData(req: Request, res: Response) {
  try {
    const result = validationResult(req);

    if (!result.isEmpty())
      return res.status(400).json({ errors: result.array() });

    const { userId } = req.params;

    const response = await getUserData(userId);
    return res.status(200).json(response);
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
