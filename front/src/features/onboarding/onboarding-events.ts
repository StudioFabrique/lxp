export const ONBOARDING_EVENT = "lxp:onboarding";

export type OnboardingEventDetail =
  | { type: "restart" }
  | { type: "formation_created"; id: number }
  | { type: "parcours_created"; id: number }
  | { type: "module_created"; id: number }
  | { type: "course_form_opened" }
  | { type: "course_created"; id: number }
  | { type: "lesson_form_opened" }
  | { type: "lesson_created"; id: number }
  | { type: "activity_creation_started" }
  | { type: "activity_type_selected"; activityType: string }
  | { type: "activity_created"; id?: number };

export const emitOnboardingEvent = (detail: OnboardingEventDetail) => {
  window.dispatchEvent(
    new CustomEvent<OnboardingEventDetail>(ONBOARDING_EVENT, { detail }),
  );
};

export const subscribeToOnboardingEvents = (
  listener: (detail: OnboardingEventDetail) => void,
) => {
  const handleEvent = (event: Event) => {
    listener((event as CustomEvent<OnboardingEventDetail>).detail);
  };

  window.addEventListener(ONBOARDING_EVENT, handleEvent);
  return () => window.removeEventListener(ONBOARDING_EVENT, handleEvent);
};
