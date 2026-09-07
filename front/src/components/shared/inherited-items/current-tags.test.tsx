import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import CurrentTags from "./current-tags";

let root: Root | null = null;

afterEach(() => {
  if (root) act(() => root?.unmount());
  root = null;
});

describe("CurrentTags", () => {
  it("désactive le retrait et masque la croix d'une association verrouillée", () => {
    const container = document.createElement("div");
    const onRemove = vi.fn();
    root = createRoot(container);

    act(() => {
      root?.render(
        <CurrentTags
          list={[
            { id: 1, name: "Personnel", color: "#fff" },
            { id: 2, name: "Protégé", color: "#000" },
          ]}
          lockedItemIds={[2]}
          onRemoveItem={onRemove}
        />,
      );
    });

    const items = [...container.querySelectorAll("li")];
    const personal = items.find((item) => item.textContent?.includes("Personnel"));
    const locked = items.find((item) => item.textContent?.includes("Protégé"));

    expect(personal?.querySelector("svg")).not.toBeNull();
    expect(locked?.querySelector("svg")).toBeNull();
    expect(locked?.querySelector("button")?.disabled).toBe(true);

    act(() => locked?.click());
    expect(onRemove).not.toHaveBeenCalled();

    act(() => personal?.click());
    expect(onRemove).toHaveBeenCalledOnce();
    expect(onRemove).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1 }),
    );
  });
});
