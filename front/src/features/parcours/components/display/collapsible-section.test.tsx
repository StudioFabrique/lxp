import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import CollapsibleSection from "./collapsible-section";

describe("CollapsibleSection", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
  });

  it("est repliée par défaut puis se déplie au clic", async () => {
    await act(async () => {
      root.render(
        <CollapsibleSection
          title="Description"
          preview={<span>Aperçu du contenu</span>}
        >
          <p>Contenu du parcours</p>
        </CollapsibleSection>,
      );
    });

    const details = container.querySelector("details");
    const summary = container.querySelector("summary");

    expect(details?.open).toBe(false);
    expect(summary?.textContent).toContain("Aperçu du contenu");

    await act(async () => summary?.click());

    expect(details?.open).toBe(true);
  });
});
