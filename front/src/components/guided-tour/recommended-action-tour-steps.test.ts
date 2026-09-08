import { describe, expect, it } from "vitest";

import { moduleCreationTourSteps } from "./recommended-action-tour-steps";

describe("moduleCreationTourSteps", () => {
  it("laisse le formulaire de module entièrement cliquable pendant la visite", () => {
    expect(moduleCreationTourSteps).not.toHaveLength(0);
    expect(
      moduleCreationTourSteps.every((step) => step.hideOverlay === true),
    ).toBe(true);
  });
});
