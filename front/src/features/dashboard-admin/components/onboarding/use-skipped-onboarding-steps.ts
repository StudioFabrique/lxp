import { useCallback, useState } from "react";
import type { OnboardingStepId } from "./build-onboarding-steps";

const storageKey = (userId: string) => `lxp:onboarding:skipped:${userId}`;

// Le stockage peut être absent ou refusé (navigation privée) : le choix ne vaut alors que jusqu'au rechargement.
const read = (userId: string): OnboardingStepId[] => {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(storageKey(userId)) ?? "[]");
    return Array.isArray(value) ? (value as OnboardingStepId[]) : [];
  } catch {
    return [];
  }
};

/** Étapes optionnelles que l'utilisateur a choisi de passer, retenues par utilisateur sur cet appareil. */
export function useSkippedOnboardingSteps(userId: string | undefined) {
  const [skipped, setSkipped] = useState<OnboardingStepId[]>(() => (userId ? read(userId) : []));

  const skip = useCallback(
    (id: OnboardingStepId) => {
      setSkipped((current) => {
        const next = current.includes(id) ? current : [...current, id];
        try {
          if (userId) window.localStorage.setItem(storageKey(userId), JSON.stringify(next));
        } catch {
          // Voir read : le choix n'est alors pas conservé.
        }
        return next;
      });
    },
    [userId],
  );

  return { skipped, skip };
}
