import { type PropsWithChildren } from "react";
import { OnboardingContext } from "./OnboardingContext";

/**
 * Contexte inerte, pour la démonstration.
 *
 * Le tutoriel enregistre sa progression sur le compte (`user.onboarding`). En
 * démonstration ce compte est partagé par tous les visiteurs simultanés, et le
 * verrou lecture seule refuse l'écriture : le faire tourner n'aurait aucun sens.
 * On garde en revanche le fournisseur, plusieurs vues appelant `useOnboarding`
 * — qui lève une erreur hors de son contexte. La visite guidée de la
 * démonstration est portée par `DemoTour`.
 */
export const InertOnboarding = ({ children }: PropsWithChildren) => (
  <OnboardingContext
    value={{
      status: "skipped",
      step: "",
      isSaving: false,
      canStart: true,
      start: async () => {},
      skip: async () => {},
    }}
  >
    {children}
  </OnboardingContext>
);
