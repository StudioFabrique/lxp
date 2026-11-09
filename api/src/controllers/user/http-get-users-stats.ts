import { type Response } from "express";
import getUsersStats from "../../models/user/get-users-stats.ts";
import { serverIssue } from "../../utils/constantes.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

async function httpGetUsersStats(req: CustomRequest, res: Response) {
  try {
    const actorRank = req.auth?.userRoles[0]?.rank ?? 4;
    const result = await getUsersStats(actorRank);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: serverIssue + error });
  }
}

export default httpGetUsersStats;
