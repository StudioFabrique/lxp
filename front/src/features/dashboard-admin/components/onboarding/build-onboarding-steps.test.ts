import { describe, expect, it } from "vitest";
import { buildOnboardingSteps } from "./build-onboarding-steps";

const base = {
  isTeacher: false,
  teachersCount: 0,
  studentsCount: 0,
  groupsCount: 0,
  modulesCount: 0,
  formations: [],
};

const ids = (steps: ReturnType<typeof buildOnboardingSteps>, done: boolean) =>
  steps.filter((step) => step.isDone === done).map((step) => step.id);

describe("buildOnboardingSteps", () => {
  it("n'a aucune étape terminée sur une instance vide", () => {
    const steps = buildOnboardingSteps(base);

    expect(ids(steps, true)).toEqual([]);
    expect(steps.map((step) => step.id)).toEqual([
      "invite-teacher",
      "create-formation",
      "create-content",
      "enroll-students",
      "publish",
    ]);
  });

  it("verrouille le contenu sans formation et la publication sans contenu", () => {
    const steps = buildOnboardingSteps(base);

    expect(steps.filter((step) => step.isLocked).map((step) => step.id)).toEqual([
      "create-content",
      "enroll-students",
      "publish",
    ]);
  });

  it("considère l'invitation acquise pour un membre de l'équipe pédagogique", () => {
    const [invite] = buildOnboardingSteps({ ...base, isTeacher: true });

    expect(invite.isDone).toBe(true);
  });

  it("termine l'inscription dès qu'un groupe ou un apprenant existe", () => {
    expect(
      ids(buildOnboardingSteps({ ...base, groupsCount: 1 }), true),
    ).toEqual(["enroll-students"]);
    expect(
      ids(buildOnboardingSteps({ ...base, studentsCount: 2 }), true),
    ).toEqual(["enroll-students"]);
  });

  it("déverrouille puis termine les étapes avec le contenu publié", () => {
    const steps = buildOnboardingSteps({
      ...base,
      modulesCount: 1,
      formations: [
        {
          id: 1,
          title: "Formation",
          level: "1",
          parcours: [
            { id: 1, title: "P", startDate: null, endDate: null, isPublished: true, thumb: null },
          ],
        },
      ],
    });

    expect(steps.some((step) => step.isLocked)).toBe(false);
    expect(ids(steps, true)).toEqual(["create-formation", "create-content", "publish"]);
  });

  it("n'ajoute l'administrateur supplémentaire, optionnel, que pour le compte principal", () => {
    expect(buildOnboardingSteps(base).some((step) => step.id === "add-admin")).toBe(false);

    const steps = buildOnboardingSteps({ ...base, canAddAdmin: true, adminsCount: 0 });
    const admin = steps[steps.length - 1];

    expect(admin).toMatchObject({ id: "add-admin", isOptional: true, isDone: false, isLocked: false });
    expect(
      buildOnboardingSteps({ ...base, canAddAdmin: true, adminsCount: 1 }).find((step) => step.id === "add-admin")?.isDone,
    ).toBe(true);
  });
});
