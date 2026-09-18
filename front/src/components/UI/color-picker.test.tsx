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

  it("affiche une palette compacte à droite de la pastille", async () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    await act(async () =>
      root.render(
        <ColorPicker compact defaultColor="#ffffff" onColorChange={vi.fn()} />,
      ),
    );

    const menu = container.querySelector(".dropdown-content");
    const trigger = container.querySelector<HTMLElement>(
      '[role="button"][aria-label="Couleur de fond du logo"]',
    );
    expect(trigger?.style.backgroundColor).toBe("rgb(255, 255, 255)");
    expect(trigger?.style.borderColor).toBe("rgb(203, 213, 225)");
    expect(menu?.className).toContain("sm:left-full");
    expect(menu?.textContent).toContain("Choisir une couleur de fond");
    expect(menu?.querySelector(".grid-cols-4")?.children).toHaveLength(8);
    expect(
      Array.from(menu?.querySelectorAll(".grid-cols-4 button") ?? []).map(
        (button) => button.getAttribute("title"),
      ),
    ).toEqual([
      "White",
      "Black",
      "Slate",
      "Blue",
      "Purple",
      "Orange",
      "Green",
      "Teal",
    ]);
  });
});
