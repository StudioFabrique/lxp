import { Request, Response } from "express";
import getUsersStats from "../../models/user/get-users-stats";
import { serverIssue } from "../../utils/constantes";

async function httpGetUsersStats(req: Request, res: Response) {
  try {
    const result = await getUsersStats();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: serverIssue + error });
  }
}

export default httpGetUsersStats;
