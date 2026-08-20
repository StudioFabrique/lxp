import User, {
  type IUserOnboarding,
  type OnboardingStatus,
} from "../../utils/interfaces/db/user.ts";

/**
 * Enregistre l'avancement de l'accueil d'un utilisateur.
 *
 * L'accès à la collection vit ici et non dans le contrôleur : la couche
 * `controllers` est tenue à l'écart des clients de persistance, règle vérifiée
 * par `src/helpers/tests/backend-layering.spec.ts`.
 */
export default async function patchOnboarding(
  userId: string | undefined,
  onboarding: { status: OnboardingStatus; step: string; version: number },
): Promise<IUserOnboarding | null> {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { onboarding: { ...onboarding, updatedAt: new Date() } } },
    { new: true },
  ).select("onboarding");

  return user?.onboarding ?? null;
}
