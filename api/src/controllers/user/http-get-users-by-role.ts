import { Request, Response } from "express";
import { badQuery, serverIssue } from "../../utils/constantes";
import { validationResult } from "express-validator";
import getUsersByRole from "../../models/user/get-users-by-role";

async function httpGetUsersByRole(req: Request, res: Response) {
  const result = validationResult(req);

  const { role, stype, sdir } = req.params;
  const { page, limit } = req.query;

  if (!result.isEmpty()) {
    return res.status(400).json({ message: badQuery });
  }

  try {
    const result = await getUsersByRole(+page!, +limit!, role, stype, sdir);

    if (!result) {
      return res.status(400).json({ message: badQuery });
    }

    return res.status(200).json({ total: result!.total, list: result!.users });
  } catch (err) {
    return res.status(500).json({ message: serverIssue + err });
  }
}

export default httpGetUsersByRole;
