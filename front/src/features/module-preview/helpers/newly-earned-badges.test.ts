import { describe, expect, it } from "vitest";
import type Module from "../../../utils/interfaces/module";
import { newlyEarnedBadges } from "./newly-earned-badges";

const before = {
  id: 1,
  stats: { isCompleted: false },
  bonusSkills: [
    { id: 1, description: "Premier", badge: "one.png", isEarned: false },
    { id: 2, description: "Partagé", badge: "two.png", isEarned: false },
    { id: 3, description: "Troisième", badge: "three.png", isEarned: false },
    { id: 4, description: "Sans badge", isEarned: false },
  ],
} as Module;
const after = {
  ...before,
  stats: { isCompleted: true },
  bonusSkills: before.bonusSkills.map((skill) => ({ ...skill, isEarned: skill.id !== 2 })),
};

describe("Badges obtenus à la complétion d'un module", () => {
  it("conserve l'ordre des badges obtenus et attend les autres modules du badge partagé", () => {
    expect(newlyEarnedBadges(before, after).map(({ id }) => id)).toEqual([1, 3]);
  });

  it("ne célèbre pas un module incomplet ou déjà terminé", () => {
    expect(newlyEarnedBadges(before, before)).toEqual([]);
    expect(newlyEarnedBadges(after, after)).toEqual([]);
  });

  it("ignore les badges déjà acquis et les changements de module", () => {
    expect(newlyEarnedBadges({ ...before, bonusSkills: after.bonusSkills }, after)).toEqual([]);
    expect(newlyEarnedBadges(before, { ...after, id: 2 })).toEqual([]);
  });
});
