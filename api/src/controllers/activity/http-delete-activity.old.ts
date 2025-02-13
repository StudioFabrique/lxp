import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import deleteActivity from "../../models/activity/delete-activity.old";

export default async function httpDeleteActivity(req: Request, res: Response) {
  try {
    const { activityId } = req.params;
    const response = await deleteActivity(+activityId);
    return res.status(200).json(response);
  } catch (error: any) {
    console.log({ error });

    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
