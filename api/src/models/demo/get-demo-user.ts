import User from "../../utils/interfaces/db/user.ts";
import { env } from "../../config/env.ts";

export type DemoProfile = "admin" | "student";

export class DemoAccountError extends Error {}

/**
 * Compte emprunté par un visiteur de la démonstration.
 *
 * Les deux comptes sont ordinaires : ils portent les rôles habituels, avec
 * toutes leurs permissions, pour que l'interface s'affiche telle qu'un client
 * la verrait. Ce n'est pas leur ability qui interdit d'écrire, c'est le verrou
 * `demo-read-only`, monté devant `/v1`.
 */
export default async function getDemoUser(profile: DemoProfile) {
  const email =
    profile === "admin"
      ? env.DEMO_ADMIN_EMAIL
      : env.DEMO_STUDENT_EMAIL;

  if (!email) {
    throw new DemoAccountError(
      `Aucun compte de démonstration configuré pour le profil « ${profile} »`,
    );
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("_id isActive");

  if (!user || !user.isActive) {
    throw new DemoAccountError(
      "Le compte de démonstration est introuvable ou désactivé",
    );
  }

  return user._id.toString();
}
