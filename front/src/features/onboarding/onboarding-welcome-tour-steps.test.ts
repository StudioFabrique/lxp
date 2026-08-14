import { describe, expect, it } from "vitest";

import { onboardingWelcomeTourSteps } from "./onboarding-welcome-tour-steps";

describe("onboardingWelcomeTourSteps", () => {
  it("guide directement vers le bouton qui démarre le tutoriel", () => {
    expect(onboardingWelcomeTourSteps).toHaveLength(1);
    expect(onboardingWelcomeTourSteps[0]).toMatchObject({
      id: "onboarding-welcome-start",
      target: '[data-onboarding="welcome-start"]',
      skipBeacon: true,
      blockTargetInteraction: false,
      disableFocusTrap: true,
    });
  });
});
