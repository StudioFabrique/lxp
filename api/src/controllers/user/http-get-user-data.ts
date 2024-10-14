import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import getUserData from "../../models/user/get-user-data";

export default async function httpGetUserData(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    const response = await getUserData(userId);
    return res.status(200).json(response);
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
