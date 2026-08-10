import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import getUsersByIds from "../../models/user/get-users-by-ids.ts";
import { serverIssue } from "../../utils/constantes.ts";

export default async function httpGetUsersByIds(
  req: Request,
  res: Response,
) {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(400).json({ errors: validation.array() });
  }

  try {
    const ids = String(req.query.ids).split(",").filter(Boolean);
    const users = await getUsersByIds(ids);
    return res.status(200).json({ list: users });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
