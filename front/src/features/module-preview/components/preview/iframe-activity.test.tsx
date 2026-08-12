import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import IframeActivity from "./iframe-activity";

const mountedRoots: Array<ReturnType<typeof createRoot>> = [];

afterEach(() => {
  for (const root of mountedRoots) {
    act(() => root.unmount());
  }
  mountedRoots.length = 0;
});

const renderIframeActivity = (
  props: Partial<React.ComponentProps<typeof IframeActivity>> = {},
) => {
  const container = document.createElement("div");
  const root = createRoot(container);
  mountedRoots.push(root);

  act(() => {
    root.render(
      <IframeActivity
        mode="read"
        onChangeSrc={vi.fn()}
        onSave={vi.fn().mockResolvedValue(true)}
        onFinishSaving={vi.fn()}
        {...props}
      />,
    );
  });

  return container;
};

describe("IframeActivity", () => {
  it("affiche une URL invalide sans mettre à jour l'état pendant le rendu", () => {
    const container = renderIframeActivity({ src: "url-invalide" });

    expect(container.textContent).toContain(
      "Aucune ressource iframe disponible.",
    );
  });

  it("ne resynchronise pas une URL déjà identique en mode édition", () => {
    const onChangeSrc = vi.fn();

    renderIframeActivity({
      mode: "edit",
      src: "https://example.com/embed",
      onChangeSrc,
    });

    expect(onChangeSrc).not.toHaveBeenCalled();
  });
});
