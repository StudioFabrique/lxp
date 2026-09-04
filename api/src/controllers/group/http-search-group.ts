import { type Response } from "express";
import { badQuery, serverIssue } from "../../utils/constantes.ts";
import searchGroup from "../../models/group/search-group.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

async function httpSearchGroup(req: CustomRequest, res: Response) {
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
      sdir,
      req.auth!,
    );

    if (!result) {
      return res.status(400).json({ message: badQuery });
    }

    return res
      .status(200)
      .json({ total: result!.total, list: result!.groupsWithFormation });
  } catch (err) {
    return res.status(500).json({ message: serverIssue + err });
  }
}

export default httpSearchGroup;
