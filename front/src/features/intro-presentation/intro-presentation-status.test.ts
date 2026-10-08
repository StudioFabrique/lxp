import { describe, expect, it } from "vitest";

import {
  isDashboardLanding,
  isIntroStillPending,
  shouldAutoOpenIntro,
} from "./intro-presentation-status";

const base = {
  status: "pending" as const,
  pathname: "/admin/dashboard",
  isEligible: true,
  demoMode: false,
};

describe("shouldAutoOpenIntro", () => {
  it("s'ouvre sur le dashboard tant que la présentation est à voir", () => {
    expect(shouldAutoOpenIntro(base)).toBe(true);
    expect(shouldAutoOpenIntro({ ...base, pathname: "/student/dashboard" })).toBe(true);
    expect(shouldAutoOpenIntro({ ...base, status: "in_progress" })).toBe(true);
  });

  it("ne s'ouvre plus une fois ignorée ou terminée", () => {
    expect(shouldAutoOpenIntro({ ...base, status: "skipped" })).toBe(false);
    expect(shouldAutoOpenIntro({ ...base, status: "completed" })).toBe(false);
  });

  it("ne s'ouvre pas hors du dashboard, en démonstration ou si le compte n'est pas prêt", () => {
    expect(shouldAutoOpenIntro({ ...base, pathname: "/admin/parcours" })).toBe(false);
    expect(shouldAutoOpenIntro({ ...base, demoMode: true })).toBe(false);
    expect(shouldAutoOpenIntro({ ...base, isEligible: false })).toBe(false);
  });
});

describe("isIntroStillPending", () => {
  it("distingue les statuts à enregistrer", () => {
    expect(isIntroStillPending("pending")).toBe(true);
    expect(isIntroStillPending("in_progress")).toBe(true);
    expect(isIntroStillPending("skipped")).toBe(false);
    expect(isIntroStillPending("completed")).toBe(false);
  });
});

describe("isDashboardLanding", () => {
  it("reconnaît le dashboard et les adresses qui y redirigent", () => {
    for (const path of ["/", "/admin", "/student", "/admin/dashboard", "/student/dashboard/"]) {
      expect(isDashboardLanding(path)).toBe(true);
    }
    for (const path of ["/admin/parcours", "/student/calendrier", "/login"]) {
      expect(isDashboardLanding(path)).toBe(false);
    }
  });
});
