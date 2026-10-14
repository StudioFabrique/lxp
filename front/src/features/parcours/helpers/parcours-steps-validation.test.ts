import { describe, expect, it } from "vitest";

import {
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
      "Aucune ressource pédagogique affectée",
      "Aucune compétence ajoutée",
    ]);
  });

  it("ne signale que ce qui manque", () => {
    const requirements = { duration: 15, contacts: [], skills: [{}] };

    expect(getMissingModuleRequirements(requirements)).toEqual([
      "Aucune ressource pédagogique affectée",
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
