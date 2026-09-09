import { act, useState } from "react";
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

  it("peut être dépliée par défaut", async () => {
    await act(async () => {
      root.render(
        <CollapsibleSection
          title="Ressources pédagogiques"
          preview={<span>Aperçu des ressources</span>}
          defaultOpen
        >
          <p>Deux ressources</p>
        </CollapsibleSection>,
      );
    });

    expect(container.querySelector("details")?.open).toBe(true);
  });

  it("peut partager son état avec une autre section", async () => {
    const SynchronizedSections = () => {
      const [open, setOpen] = useState(false);

      return (
        <>
          <CollapsibleSection
            title="Tags"
            preview={<span>Aperçu des tags</span>}
            open={open}
            onOpenChange={setOpen}
          >
            <p>Tous les tags</p>
          </CollapsibleSection>
          <CollapsibleSection
            title="Ressources pédagogiques"
            preview={<span>Aperçu des ressources</span>}
            open={open}
            onOpenChange={setOpen}
          >
            <p>Toutes les ressources</p>
          </CollapsibleSection>
        </>
      );
    };

    await act(async () => root.render(<SynchronizedSections />));

    const details = container.querySelectorAll("details");
    const summaries = container.querySelectorAll("summary");

    expect([...details].every((section) => !section.open)).toBe(true);

    await act(async () => {
      summaries[0]?.click();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect([...details].every((section) => section.open)).toBe(true);

    await act(async () => {
      summaries[1]?.click();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect([...details].every((section) => !section.open)).toBe(true);
  });
});
