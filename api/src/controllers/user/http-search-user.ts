import { Request, Response } from "express";
import searchUser from "../../models/user/search-user";
import { badQuery, serverIssue } from "../../utils/constantes";

async function httpSearchUser(req: Request, res: Response) {
  const { entity, role, value, stype, sdir } = req.params;
  const { page, limit } = req.query;

  console.log({ role });

  try {
    const result = await searchUser(
      entity,
      value,
      role,
      +page!,
      +limit!,
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

export default httpSearchUser;
