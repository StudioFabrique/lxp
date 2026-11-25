import User from "../../utils/interfaces/db/user.ts";

/** `null` si le compte est introuvable, sinon `true` tant que l'onboarding n'est pas terminé. */
export async function isStaffOnboardingRequired(userId: string) {
  const user = await User.findById(userId).select("staffOnboardingCompletedAt").lean();
  return user ? !user.staffOnboardingCompletedAt : null;
}

/** Retourne `false` si le compte est introuvable. */
export async function completeStaffOnboardingForUser(userId: string) {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { staffOnboardingCompletedAt: new Date() } },
    { new: true },
  )
    .select("staffOnboardingCompletedAt")
    .lean();
  return Boolean(user);
}
