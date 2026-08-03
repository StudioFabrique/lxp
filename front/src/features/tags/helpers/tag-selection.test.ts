import { describe, expect, it } from "vitest";

import type Tag from "../../../utils/interfaces/tag";
import { addPendingTag } from "./tag-selection";

const existingTag: Tag = {
  id: 12,
  name: "Design",
  color: "rgba(0, 0, 255, 0.5)",
};

describe("addPendingTag", () => {
  it("intègre la saisie en attente lors de la validation", () => {
    const result = addPendingTag([], [], "  Nouveau tag  ");

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Nouveau tag");
    expect(result[0].color).toMatch(/^rgba\(/);
  });

  it("réutilise un tag existant sans créer de doublon", () => {
    expect(addPendingTag([], [existingTag], "design")).toEqual([existingTag]);
    expect(addPendingTag([existingTag], [existingTag], "DESIGN")).toEqual([
      existingTag,
    ]);
  });

  it("ignore une saisie vide", () => {
    expect(addPendingTag([], [], "   ")).toEqual([]);
  });
});
