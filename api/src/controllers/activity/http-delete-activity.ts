import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import deleteActivity from "../../models/activity/delete-activity";

export default async function httpDeleteActivity(req: Request, res: Response) {
  try {
    const { activId } = req.params;
    const response = await deleteActivity(+activId);
    return res.status(200).json(response);
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
