import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { TagRow } from "../api/tag.api";
import { getTagColumns } from "./tag-table-columns";

describe("getTagColumns", () => {
  it("affiche le titre du tag avec sa couleur", () => {
    const tag: TagRow = {
      id: 1,
      name: "Design",
      color: "rgb(12, 34, 56)",
      totalUses: 0,
      parcours: [],
    };
    const titleCell = getTagColumns(() => undefined)[1].cell;

    expect(typeof titleCell).toBe("function");
    if (typeof titleCell !== "function") return;

    const markup = renderToStaticMarkup(
      titleCell({ row: { original: tag } } as never),
    );

    expect(markup).toContain("#Design");
    expect(markup).toContain("background-color:rgb(12, 34, 56)");
  });
});
