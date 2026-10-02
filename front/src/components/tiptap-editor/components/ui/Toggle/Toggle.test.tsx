import { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import { Toggle } from "./Toggle";

it("associe le switch à son label et transmet le nouvel état", async () => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const onChange = vi.fn();
  const render = (active: boolean) => (
    <label>
      Ouvrir dans un nouvel onglet
      <Toggle active={active} onChange={onChange} />
    </label>
  );

  try {
    await act(async () => root.render(render(false)));
    const input = container.querySelector<HTMLInputElement>('[role="switch"]')!;
    expect(input.checked).toBe(false);
    expect(input.labels?.[0]?.textContent).toContain("Ouvrir dans un nouvel onglet");

    await act(async () => input.labels?.[0]?.click());
    expect(onChange).toHaveBeenLastCalledWith(true);

    await act(async () => root.render(render(true)));
    expect(input.checked).toBe(true);
    expect(input.getAttribute("aria-checked")).toBe("true");
    await act(async () => input.click());
    expect(onChange).toHaveBeenLastCalledWith(false);
  } finally {
    await act(async () => root.unmount());
    container.remove();
  }
});
