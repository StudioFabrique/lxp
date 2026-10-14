import { describe, expect, it } from "vitest";

import {
  INTRO_ROLES,
  buildIntroRoleSweep,
  findIntroRole,
  getIntroSpace,
} from "./intro-role";

describe("intro-role", () => {
  it("retrouve le rôle principal par son rang", () => {
    expect(findIntroRole([{ rank: 2 }])?.label).toBe("Équipe pédagogique");
    expect(findIntroRole([{ rank: 9 }])).toBeNull();
    expect(findIntroRole([])).toBeNull();
    expect(findIntroRole(undefined)).toBeNull();
  });

  it("montre l'espace apprenant au rang 3 et celui de l'équipe aux autres", () => {
    const spaces = INTRO_ROLES.map((role) => getIntroSpace(role));

    expect(spaces).toEqual(["team", "team", "team", "student"]);
  });

  it("parcourt la liste une fois puis s'arrête sur le rôle détecté", () => {
    for (const target of [0, 1, 2, 3]) {
      const sweep = buildIntroRoleSweep(4, target);

      expect(sweep[sweep.length - 1]).toBe(target);
      expect(sweep).toHaveLength(4 + target + 1);
      expect(sweep.slice(0, 4)).toEqual([0, 1, 2, 3]);
    }
  });
});
