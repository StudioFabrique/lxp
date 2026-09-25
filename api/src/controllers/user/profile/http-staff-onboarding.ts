import type { Response } from "express";
import type CustomRequest from "../../../utils/interfaces/express/custom-request.ts";
import User from "../../../utils/interfaces/db/user.ts";

export async function getStaffOnboarding(req: CustomRequest, res: Response) {
  if (req.auth?.userRoles[0]?.rank !== 1) return res.status(403).json({ message: "Réservé aux administrateurs" });
  const user = await User.findById(req.auth.userId).select("staffOnboardingCompletedAt").lean();
  if (!user) return res.status(404).json({ message: "Compte introuvable" });
  return res.json({ required: !user.staffOnboardingCompletedAt });
}

export async function completeStaffOnboarding(req: CustomRequest, res: Response) {
  if (req.auth?.userRoles[0]?.rank !== 1) return res.status(403).json({ message: "Réservé aux administrateurs" });
  const user = await User.findByIdAndUpdate(req.auth.userId, {
    $set: { staffOnboardingCompletedAt: new Date() },
  }, { new: true }).select("staffOnboardingCompletedAt").lean();
  if (!user) return res.status(404).json({ message: "Compte introuvable" });
  return res.json({ required: false });
}
