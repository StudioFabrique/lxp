import { describe, expect, it } from "vitest";
import type { FormationParcoursSummary } from "../interfaces/parcours-summary";
import { buildRecommendedActions } from "./build-recommended-actions";

const parcours: FormationParcoursSummary[] = [
  {
    id: 1,
    title: "Formation",
    level: "5",
    parcours: [
      {
        id: 42,
        title: "Parcours formateur",
        startDate: null,
        endDate: null,
        isPublished: false,
        thumb: null,
        canManage: true,
      },
    ],
  },
];

describe("buildRecommendedActions", () => {
  it("ordonne les actions root et exclut bien le compte root du besoin d'admin", () => {
    const actions = buildRecommendedActions({
      userRank: 0,
      teachersCount: 0,
      adminsCount: 0,
      parcours: [],
    });

    expect(actions.map(({ id }) => id)).toEqual([
      "invite-teachers",
      "create-admin",
      "change-logo",
    ]);
  });

  it("ne propose pas à un admin de créer un autre admin", () => {
    const actions = buildRecommendedActions({
      userRank: 1,
      teachersCount: 1,
      parcours: [],
    });

    expect(actions.map(({ id }) => id)).toEqual(["change-logo"]);
  });

  it("ordonne les actions formateur et ouvre le premier parcours rattaché", () => {
    const actions = buildRecommendedActions({
      userRank: 2,
      studentsCount: 0,
      groupsCount: 0,
      parcours,
    });

    expect(actions.map(({ id }) => id)).toEqual([
      "invite-students",
      "create-group",
      "create-module",
    ]);
    expect(actions[2].to).toContain("/admin/parcours/edit/42");
  });

  it("n'affiche pas la création de module sans parcours rattaché", () => {
    const actions = buildRecommendedActions({
      userRank: 2,
      studentsCount: 1,
      groupsCount: 1,
      parcours: [],
    });

    expect(actions).toEqual([]);
  });
});
