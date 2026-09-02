import { describe, expect, it } from "vitest";

import { moduleCreateSchema } from "./parcours.schema";

const validModule = {
  title: "Module de test",
  description: "",
  quizInstructions: "",
  duration: 1,
};

describe("moduleCreateSchema - durée", () => {
  it.each([
    [undefined, "La durée du module est obligatoire"],
    [Number.NaN, "La durée du module est obligatoire"],
    [0, "La durée du module doit être supérieure à 0 heure"],
    [-2, "La durée du module doit être supérieure à 0 heure"],
  ])("refuse la durée %s avec un message métier", (duration, message) => {
    const result = moduleCreateSchema.safeParse({ ...validModule, duration });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(message);
    }
  });

  it("accepte une durée décimale positive", () => {
    expect(
      moduleCreateSchema.safeParse({ ...validModule, duration: 1.5 }).success,
    ).toBe(true);
  });
});
