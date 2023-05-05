import { Request, Response } from "express";
import { badQuery, serverIssue } from "../../../utils/constantes";
import getAllUsers from "../../../models/user/admin-teacher/getAllUsers";
import { validationResult } from "express-validator";
import { roles } from "../../../utils/services/roles";

async function httpGetAllUsers(req: Request, res: Response) {
  const { role, stype, sdir } = req.params;
  const { page, limit } = req.query;

  const result = validationResult(req);

  if (!result.isEmpty() || !roles.includes(role)) {
    return res.status(400).json({ message: badQuery });
  }

  try {
    const result = await getAllUsers(+page!, +limit!, role, stype, sdir);

    return res.status(200).json({ total: result!.total, users: result!.users });
  } catch (err) {
    return res.status(500).json({ message: serverIssue + err });
  }
}

export default httpGetAllUsers;
