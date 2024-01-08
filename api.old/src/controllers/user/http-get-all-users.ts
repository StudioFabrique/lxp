import { Request, Response } from "express";
import { badQuery, serverIssue } from "../../utils/constantes";
import getAllUsers from "../../models/user/get-all-users";
import { validationResult } from "express-validator";

async function httpGetAllUsers(req: Request, res: Response) {
  const result = validationResult(req);

  const { role, stype, sdir } = req.params;
  const { page, limit } = req.query;

  if (!result.isEmpty()) {
    return res.status(400).json({ message: badQuery });
  }
  try {
    const response = await getAllUsers(+page!, +limit!, stype, sdir);

    if (!response) {
      return res.status(400).json({ message: badQuery });
    }
    return res
      .status(200)
      .json({ total: response.total, list: response.users });
  } catch (error) {
    return res.status(500).json({ message: serverIssue + error });
  }
}

export default httpGetAllUsers;
