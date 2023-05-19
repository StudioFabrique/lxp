import { Request, Response } from "express";
import { badQuery, serverIssue } from "../../utils/constantes";
import { validationResult } from "express-validator";
import getAllGroups from "../../models/group/get-all-groups";

async function httpGetAllGroups(req: Request, res: Response) {
  const result = validationResult(req);

  const { role, stype, sdir } = req.params;
  const { page, limit } = req.query;

  if (!result.isEmpty()) {
    console.log({ result });

    return res.status(400).json({ message: badQuery });
  }

  try {
    const result = await getAllGroups(+page!, +limit!, role, stype, sdir);

    if (!result) {
      return res.status(400).json({ message: badQuery });
    }
    console.log(result);

    return res.status(200).json({ total: result!.total, list: result!.groups });
  } catch (err) {
    return res.status(500).json({ message: serverIssue + err });
  }
}

export default httpGetAllGroups;
