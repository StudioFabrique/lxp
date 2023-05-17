import { Request, Response } from "express";
import searchUser from "../../models/user/search-user";
import { badQuery, serverIssue } from "../../utils/constantes";

async function httpSearchUser(req: Request, res: Response) {
  const { entity, userType, value, sdir } = req.params;
  const { page, limit } = req.query;

  try {
    const result = await searchUser(
      entity,
      value,
      +userType,
      +page!,
      +limit!,
      sdir
    );

    if (!result) {
      return res.status(400).json({ message: badQuery });
    }

    return res.status(200).json({ total: result!.total, users: result!.users });
  } catch (err) {
    return res.status(500).json({ message: serverIssue + err });
  }
}

export default httpSearchUser;
