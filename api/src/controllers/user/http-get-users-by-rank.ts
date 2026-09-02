import { type Response } from "express";
import { badQuery, serverIssue } from "../../utils/constantes.ts";
import { validationResult } from "express-validator";
import getUsersByRank from "../../models/user/get-users-by-rank.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

async function httpGetUsersByRank(req: CustomRequest, res: Response) {
  const result = validationResult(req);
  const { rank, stype, sdir } = req.params;
  const { page, limit, search, exclude } = req.query;

  if (!result.isEmpty()) {
    return res.status(400).json({ message: badQuery });
  }

  try {
    const result = await getUsersByRank(
      +page!,
      +limit!,
      parseInt(rank),
      stype,
      sdir,
      typeof search === "string" ? search : undefined,
      typeof exclude === "string" ? exclude.split(",").filter(Boolean) : [],
      Math.min(...req.auth!.userRoles.map(({ rank }) => rank), 4),
    );

    if (!result) {
      return res.status(400).json({ message: badQuery });
    }

    return res.status(200).json({ total: result!.total, list: result!.users });
  } catch (err) {
    return res.status(500).json({ message: serverIssue + err });
  }
}

export default httpGetUsersByRank;
