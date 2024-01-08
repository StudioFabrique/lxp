import { Request, Response } from "express";
import { badQuery, serverIssue } from "../../utils/constantes";
import { validationResult } from "express-validator";
import getUsersByRank from "../../models/user/get-users-by-rank";

async function httpGetUsersByRank(req: Request, res: Response) {
  const result = validationResult(req);

  const { rank, stype, sdir } = req.params;
  const { page, limit } = req.query;

  if (!result.isEmpty()) {
    return res.status(400).json({ message: badQuery });
  }

  try {
    const result = await getUsersByRank(
      +page!,
      +limit!,
      parseInt(rank),
      stype,
      sdir
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
