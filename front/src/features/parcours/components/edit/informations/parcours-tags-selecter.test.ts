import { describe, expect, it } from "vitest";

import Tag from "../../../../../../src/utils/interfaces/tag";
import { splitAvailableTags } from "./tags-selector.helpers";

const tags: Tag[] = [
  { id: 1, name: "Design", color: "#fff" },
  { id: 2, name: "Développement", color: "#000" },
  { id: 3, name: "Marketing", color: "#f00" },
];

describe("splitAvailableTags", () => {
  it("sépare les tags de la formation des tags globaux", () => {
    const result = splitAvailableTags(tags, [tags[0], tags[2]]);

    expect(result.inheritedTags.map((tag) => tag.id)).toEqual([1, 3]);
    expect(result.globalTags.map((tag) => tag.id)).toEqual([2]);
  });

  it("applique la recherche aux deux groupes sans tenir compte de la casse", () => {
    const result = splitAvailableTags(tags, [tags[0]], "DÉV");

    expect(result.inheritedTags).toEqual([]);
    expect(result.globalTags.map((tag) => tag.id)).toEqual([2]);
  });
});
