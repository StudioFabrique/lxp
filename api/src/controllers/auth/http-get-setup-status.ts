import { type Request, type Response } from "express";
import { getSetupStatus } from "../../models/auth/setup.ts";

export default async function httpGetSetupStatus(
  _req: Request,
  res: Response,
) {
  try {
    return res.status(200).json({ hasAdmins: await getSetupStatus() });
  } catch {
    return res.status(200).json({ hasAdmins: true });
  }
}
