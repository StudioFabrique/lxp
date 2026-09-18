import { act, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import ColorPicker from "./color-picker";

describe("ColorPicker", () => {
  let container: HTMLDivElement;
  let root: Root;

  afterEach(() => {
    act(() => root?.unmount());
    container?.remove();
    vi.restoreAllMocks();
  });

  it("conserve le focus pendant le choix d'une couleur personnalisée", async () => {
    const ControlledPicker = () => {
      const [color, setColor] = useState("#ffffff");
      return <ColorPicker defaultColor={color} onColorChange={setColor} />;
    };

    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    await act(async () => root.render(<ControlledPicker />));

    const input = container.querySelector<HTMLInputElement>(
      'input[type="color"]',
    );
    expect(input).not.toBeNull();
    input?.focus();
    const blur = vi.spyOn(input!, "blur");

    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )?.set;
      setter?.call(input, "#123456");
      input?.dispatchEvent(new Event("input", { bubbles: true }));
      input?.dispatchEvent(new Event("change", { bubbles: true }));
    });

    expect(blur).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(input);
    expect(container.textContent).toContain("#123456");
  });
});
