import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import getUser from "../../models/user/get-user";

export default async function httpGetUser(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const response = await getUser(new Object(userId));
    return res.status(200).json(response);
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
