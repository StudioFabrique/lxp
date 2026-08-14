import { createContext, useContext } from "react";

import type { OnboardingStatus } from "../../utils/interfaces/user";

type OnboardingContextValue = {
  status: OnboardingStatus;
  step: string;
  isSaving: boolean;
  start: () => Promise<void>;
  skip: () => Promise<void>;
};

export const OnboardingContext =
  createContext<OnboardingContextValue | null>(null);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error(
      "useOnboarding doit être utilisé à l’intérieur de OnboardingTour.",
    );
  }

  return context;
};
