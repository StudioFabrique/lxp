import type { Response } from "express";
import type CustomRequest from "../../../utils/interfaces/express/custom-request.ts";
import {
  completeStaffOnboardingForUser,
  isStaffOnboardingRequired,
} from "../../../models/user/staff-onboarding.ts";

export async function getStaffOnboarding(req: CustomRequest, res: Response) {
  if (req.auth?.userRoles[0]?.rank !== 1) return res.status(403).json({ message: "Réservé aux administrateurs" });
  const required = await isStaffOnboardingRequired(req.auth.userId);
  if (required === null) return res.status(404).json({ message: "Compte introuvable" });
  return res.json({ required });
}

export async function completeStaffOnboarding(req: CustomRequest, res: Response) {
  if (req.auth?.userRoles[0]?.rank !== 1) return res.status(403).json({ message: "Réservé aux administrateurs" });
  if (!(await completeStaffOnboardingForUser(req.auth.userId))) return res.status(404).json({ message: "Compte introuvable" });
  return res.json({ required: false });
}
