import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import ObjectiveItem from "./objective-item";

describe("ObjectiveItem", () => {
  it("affiche l'objectif sans commandes en lecture seule", () => {
    const markup = renderToStaticMarkup(
      <ObjectiveItem
        objective={{ id: 1, description: "Comprendre les permissions" }}
        onDelete={vi.fn()}
        onUpdate={vi.fn()}
        readOnly
      />,
    );

    expect(markup).toContain("Comprendre les permissions");
    expect(markup).toContain("modification de l&#x27;objectif");
    expect(markup).toContain("suppression de l&#x27;objectif");
    expect(markup.match(/disabled=""/g)).toHaveLength(2);
  });
});
