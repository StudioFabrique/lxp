import { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";

import ButtonAdd from "./button-add";

it("empêche les clics pendant le chargement puis réactive le bouton", () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  const onClick = vi.fn();

  try {
    act(() => root.render(<ButtonAdd label="Sélectionner" loading onClickEvent={onClick} />));
    const button = container.querySelector("button")!;
    expect(button.disabled).toBe(true);
    act(() => button.click());
    expect(onClick).not.toHaveBeenCalled();

    act(() => root.render(<ButtonAdd label="Sélectionner" onClickEvent={onClick} />));
    expect(button.disabled).toBe(false);
    act(() => button.click());
    expect(onClick).toHaveBeenCalledOnce();
  } finally {
    act(() => root.unmount());
  }
});
