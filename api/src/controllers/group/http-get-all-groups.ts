import { type Response } from "express";
import { badQuery, serverIssue } from "../../utils/constantes.ts";
import { validationResult } from "express-validator";
import getAllGroups from "../../models/group/get-all-groups.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

async function httpGetAllGroups(req: CustomRequest, res: Response) {
  const result = validationResult(req);

  const { role, stype, sdir } = req.params;
  const { page, limit } = req.query;

  if (!result.isEmpty()) {

    return res.status(400).json({ message: badQuery });
  }

  try {
    const result = await getAllGroups(
      +page!,
      +limit!,
      role,
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

export default httpGetAllGroups;
