import { type Response } from "express";
import getUserProfileSkills from "../../../models/user/get-user-profile-skills.ts";
import { noAccess, serverIssue } from "../../../utils/constantes.ts";
import type CustomRequest from "../../../utils/interfaces/express/custom-request.ts";

export default async function httpGetUserProfileSkills(
  req: CustomRequest,
  res: Response,
) {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(403).json({ message: noAccess });
    }

    const skills = await getUserProfileSkills(userId);
    return res.status(200).json({ data: skills });
  } catch {
    return res.status(500).json({ message: serverIssue });
  }
}
