import { type Response } from "express";
import searchUser from "../../models/user/search-user.ts";
import { serverIssue } from "../../utils/constantes.ts";
import { validationResult } from "express-validator";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

async function httpSearchUser(req: CustomRequest, res: Response) {
  const result = validationResult(req);

  if (!result.isEmpty) {
    return res.status(400).json({ errors: result.array() });
  }

  const { entity, role, value, stype, sdir } = req.params;
  const { page, limit } = req.query;

  try {
    const actorRank = Math.min(
      ...req.auth!.userRoles.map(({ rank }) => rank),
      4,
    );
    const result = await searchUser(
      entity,
      value,
      role,
      +page!,
      +limit!,
      stype,
      sdir,
      actorRank,
    );

    return res.status(200).json({ total: result!.total, list: result!.users });
  } catch (err: any) {
    return res
      .status(err.statusCode ?? 500)
      .json({ message: err.message ?? serverIssue });
  }
}

export default httpSearchUser;
