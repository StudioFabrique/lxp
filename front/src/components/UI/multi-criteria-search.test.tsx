import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import MultiCriteriaSearch from "./multi-criteria-search";

let root: Root | null = null;

afterEach(() => {
  if (root) act(() => root?.unmount());
  root = null;
});

describe("MultiCriteriaSearch", () => {
  it("remplace le placeholder par les critères au focus d'un champ vide", () => {
    const container = document.createElement("div");
    root = createRoot(container);

    const renderSearch = (value: string) => {
      act(() =>
        root?.render(
          <MultiCriteriaSearch
            value={value}
            onChange={vi.fn()}
            criteria={["titre du module", "parcours", "formation"]}
            placeholder="Rechercher un module..."
          />,
        ),
      );
    };

    renderSearch("");

    const input = container.querySelector("input");

    expect(input?.placeholder).toBe("Rechercher un module...");

    act(() => {
      input?.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    });

    expect(input?.placeholder).toBe(
      "Recherche dans : titre du module, parcours, formation.",
    );

    act(() => {
      input?.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
    });

    expect(input?.placeholder).toBe("Rechercher un module...");

    act(() => {
      input?.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    });
    renderSearch("module");

    expect(input?.placeholder).toBe("Rechercher un module...");
  });
});
