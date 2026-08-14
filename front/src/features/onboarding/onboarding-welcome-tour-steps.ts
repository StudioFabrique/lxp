import type { Step } from "react-joyride";

export const onboardingWelcomeTourSteps: Step[] = [
  {
    id: "onboarding-welcome-start",
    target: '[data-onboarding="welcome-start"]',
    title: "Découvrez ANDRIA pas à pas",
    content:
      "Cette visite guidée vous présente rapidement les fonctionnalités essentielles de votre espace.",
    placement: "bottom-end",
    skipBeacon: true,
    blockTargetInteraction: false,
    disableFocusTrap: true,
    spotlightPadding: 8,
    skipScroll: true,
  },
];
