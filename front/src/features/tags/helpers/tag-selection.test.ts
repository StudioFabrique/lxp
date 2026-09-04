import { describe, expect, it } from "vitest";

import type Tag from "../../../utils/interfaces/tag";
import {
  addPendingTag,
  partitionTagInput,
  splitTagNames,
} from "./tag-selection";

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

  it("sépare les tags délimités par des virgules", () => {
    const result = addPendingTag([], [], " Design, UX, accessibilité ");

    expect(result.map((tag) => tag.name)).toEqual([
      "Design",
      "UX",
      "accessibilité",
    ]);
  });

  it("ignore les segments vides et les doublons d'une saisie multiple", () => {
    const result = addPendingTag([], [existingTag], "design, , DESIGN, UX,");

    expect(result.map((tag) => tag.name)).toEqual(["Design", "UX"]);
  });
});

describe("splitTagNames", () => {
  it("nettoie les espaces autour de chaque nom", () => {
    expect(splitTagNames("  produit, design system ,ui  ")).toEqual([
      "produit",
      "design system",
      "ui",
    ]);
  });
});

describe("partitionTagInput", () => {
  it("consomme toute une liste collée contenant des virgules", () => {
    expect(partitionTagInput("produit, design system, accessibilité")).toEqual({
      committed: "produit, design system, accessibilité",
      pending: "",
    });
  });

  it("conserve une saisie simple jusqu'à sa validation", () => {
    expect(partitionTagInput("produit")).toEqual({
      committed: "",
      pending: "produit",
    });
  });
});
