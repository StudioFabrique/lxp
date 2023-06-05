import { Request, Response } from "express";
import { badQuery, serverIssue } from "../../utils/constantes";
import searchGroup from "../../models/group/search-group";

async function httpSearchGroup(req: Request, res: Response) {
  const { entity, role, value, stype, sdir } = req.params;
  const { page, limit } = req.query;

  try {
    const result = await searchGroup(
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

    return res.status(200).json({ total: result!.total, list: result!.groups });
  } catch (err) {
    return res.status(500).json({ message: serverIssue + err });
  }
}

export default httpSearchGroup;
