import { describe, expect, it } from "vitest";

import type { FormationParcoursSummary } from "../dashboard-admin/interfaces/parcours-summary";
import {
  ADMINISTRATOR_ONBOARDING_STAGES,
  resolveOnboardingFlow,
  TEACHER_ONBOARDING_STAGES,
} from "./onboarding-flow";

const assignedParcours: FormationParcoursSummary[] = [
  {
    id: 1,
    title: "Formation",
    level: "5",
    parcours: [
      {
        id: 42,
        title: "Parcours affecté",
        startDate: null,
        endDate: null,
        isPublished: false,
        thumb: null,
        canManage: true,
      },
    ],
  },
];

describe("resolveOnboardingFlow", () => {
  it("ne propose pas l'onboarding à un formateur sans parcours affecté", () => {
    expect(resolveOnboardingFlow("admin", 2, [])).toMatchObject({
      kind: "teacher",
      canStart: false,
      firstStep: "",
    });
  });

  it("démarre le formateur sur la création d'un module de son parcours", () => {
    expect(resolveOnboardingFlow("admin", 2, assignedParcours)).toMatchObject({
      kind: "teacher",
      canStart: true,
      firstStep: "admin-module-title:42",
    });
  });

  it("guide l'administrateur de la création d'une formation à celle d'un parcours", () => {
    expect(resolveOnboardingFlow("admin", 1, assignedParcours)).toMatchObject({
      kind: "administrator",
      canStart: true,
      firstStep: "admin-formation-entry",
    });
    expect(resolveOnboardingFlow("admin", 1, []).canStart).toBe(true);
    expect(ADMINISTRATOR_ONBOARDING_STAGES).toEqual([
      "admin-formation-entry",
      "admin-formation-fields",
      "admin-formation-save",
      "admin-parcours-create",
      "admin-complete",
    ]);
  });

  it("limite le scénario formateur au module et à sa première activité", () => {
    expect(TEACHER_ONBOARDING_STAGES[0]).toBe("admin-module-title");
    expect(
      TEACHER_ONBOARDING_STAGES[TEACHER_ONBOARDING_STAGES.length - 1],
    ).toBe("admin-complete");
    expect(
      TEACHER_ONBOARDING_STAGES.some(
        (stage) => stage.includes("formation") || stage.includes("parcours"),
      ),
    ).toBe(false);
  });
});
