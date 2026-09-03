import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import EmptyStatePlaceholder from "./empty-state-placeholder";

describe("EmptyStatePlaceholder", () => {
  it("affiche un titre personnalisable", () => {
    const markup = renderToStaticMarkup(
      <EmptyStatePlaceholder title="Aucun parcours disponible" />,
    );

    expect(markup).toContain("Aucun parcours disponible");
  });

  it("affiche les actions optionnelles", () => {
    const markup = renderToStaticMarkup(
      <EmptyStatePlaceholder title="Aucune activité">
        <button type="button">Leçon suivante</button>
      </EmptyStatePlaceholder>,
    );

    expect(markup).toContain("Aucune activité");
    expect(markup).toContain("Leçon suivante");
  });

  it("sélectionne une nouvelle illustration au montage", () => {
    vi.useFakeTimers();
    const random = vi.spyOn(Math, "random").mockReturnValue(0.999);
    const container = document.createElement("div");
    const root = createRoot(container);

    try {
      act(() => root.render(<EmptyStatePlaceholder title="Aucune activité" />));
      act(() => vi.runOnlyPendingTimers());

      expect(container.querySelector(".lucide-hand-metal")).not.toBeNull();
    } finally {
      act(() => root.unmount());
      random.mockRestore();
      vi.useRealTimers();
    }
  });
});
