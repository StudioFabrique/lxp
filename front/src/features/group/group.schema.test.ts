import { describe, expect, it } from "vitest";
import { createGroupSchema } from "./group.schema";

const validGroup = {
  name: "Promotion août",
  desc: "Groupe du matin",
  formationId: 4,
};

describe("createGroupSchema", () => {
  it("accepte un groupe sans parcours", () => {
    expect(
      createGroupSchema.safeParse({ ...validGroup, parcoursId: 0 }).success,
    ).toBe(true);
  });

  it("accepte un groupe avec un parcours", () => {
    expect(
      createGroupSchema.safeParse({ ...validGroup, parcoursId: 12 }).success,
    ).toBe(true);
  });
});
