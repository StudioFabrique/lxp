import { describe, expect, it } from "vitest";

import {
  testParcoursStep,
  getMissingModuleRequirements,
  hasCompleteModuleRequirements,
} from "./parcours-steps-validation";

describe("getMissingModuleRequirements", () => {
  it("liste toutes les causes d'un module vide", () => {
    expect(
      getMissingModuleRequirements({
        duration: undefined,
        contacts: [],
        skills: [],
      }),
    ).toEqual([
      "Durée non renseignée",
      "Aucun membre de l'équipe pédagogique affecté",
      "Aucune compétence ajoutée",
    ]);
  });

  it("ne signale que ce qui manque", () => {
    const requirements = { duration: 15, contacts: [], skills: [{}] };

    expect(getMissingModuleRequirements(requirements)).toEqual([
      "Aucun membre de l'équipe pédagogique affecté",
    ]);
    expect(hasCompleteModuleRequirements(requirements)).toBe(false);
  });

  it("considère un module complet sans cause", () => {
    expect(
      hasCompleteModuleRequirements({
        duration: 15,
        contacts: [{}],
        skills: [{}],
      }),
    ).toBe(true);
  });
});

describe("testParcoursStep", () => {
  const validParcours = {
    infos: { title: "Parcours 2026", startDate: "2026-09-01", endDate: "2027-04-02" },
    tags: [{}],
    contacts: [{}],
    objectives: [{}],
    skills: [{}],
    modules: [{ duration: 10, contacts: [{}], bonusSkills: [{}] }],
    groups: [{}],
  };

  it("n'a aucune erreur quand tout est renseigné", () => {
    expect(testParcoursStep(validParcours)).toEqual([]);
  });

  it("refuse la publication d'un parcours sans groupe d'apprenants", () => {
    expect(testParcoursStep({ ...validParcours, groups: [] })).toEqual([
      { groups: "Le parcours doit avoir au moins un groupe d'apprenants rattachés" },
    ]);
  });
});
