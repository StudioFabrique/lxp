import { Request, Response } from "express";
import searchUser from "../../models/user/search-user";
import { serverIssue } from "../../utils/constantes";
import { validationResult } from "express-validator";

async function httpSearchUser(req: Request, res: Response) {
  const result = validationResult(req);

  if (!result.isEmpty) {
    return res.status(400).json({ errors: result.array() });
  }

  const { entity, role, value, stype, sdir } = req.params;
  const { page, limit } = req.query;

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

    return res.status(200).json({ total: result!.total, list: result!.users });
  } catch (err: any) {
    return res
      .status(err.statusCode ?? 500)
      .json({ message: err.message ?? serverIssue });
  }
}

export default httpSearchUser;
