import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";

import { HierarchicalListRow } from "./HierarchicalListRow";

let root: Root | null = null;

afterEach(() => {
  if (root) act(() => root?.unmount());
  root = null;
  document.body.innerHTML = "";
});

describe("HierarchicalListRow", () => {
  it("ouvre le menu d'actions au clic droit", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    act(() => {
      root?.render(
        <HierarchicalListRow
          item={{
            id: 1,
            title: "Sous-item",
            action: (_dismissOverflow, menuControl) => (
              <span data-menu-open={menuControl.open}>Actions</span>
            ),
          }}
          dismissOverflow={() => {}}
        />,
      );
    });

    const row = container.querySelector("li");
    const event = new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
    });

    act(() => {
      row?.dispatchEvent(event);
    });

    expect(event.defaultPrevented).toBe(true);
    expect(container.querySelector("[data-menu-open='true']")).not.toBeNull();
  });
});
