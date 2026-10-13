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

    await act(async () => container.querySelector("button")?.click());

    const input = document.querySelector<HTMLInputElement>(
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
    expect(document.querySelector("[role=dialog]")?.textContent).toContain("#123456");
  });

  it("affiche la palette compacte hors du conteneur qui découpe le contenu", async () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    await act(async () =>
      root.render(
        <ColorPicker compact defaultColor="#ffffff" onColorChange={vi.fn()} />,
      ),
    );

    container.style.overflow = "hidden";
    await act(async () => container.querySelector("button")?.click());

    const menu = document.querySelector("[role=dialog]");
    const trigger = container.querySelector<HTMLElement>(
      'button[aria-label="Couleur de fond du logo"]',
    );
    expect(trigger?.style.backgroundColor).toBe("var(--color-base-100)");
    expect(trigger?.style.borderColor).toBe("var(--color-base-300)");
    expect(menu).not.toBeNull();
    expect(container.contains(menu)).toBe(false);
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

  it("ferme la palette après une sélection et rend le focus au bouton", async () => {
    const onColorChange = vi.fn();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    await act(async () => root.render(<ColorPicker onColorChange={onColorChange} />));
    const trigger = container.querySelector("button");
    await act(async () => trigger?.click());
    await act(async () => document.querySelector<HTMLButtonElement>('button[title="Blue"]')?.click());

    expect(onColorChange).toHaveBeenCalledWith("#3b82f6");
    expect(document.querySelector("[role=dialog]")).toBeNull();
    await act(async () => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(document.activeElement).toBe(trigger);
  });

  it("ferme la palette avec Échap sans modifier la couleur", async () => {
    const onColorChange = vi.fn();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    await act(async () => root.render(<ColorPicker compact onColorChange={onColorChange} />));
    const trigger = container.querySelector("button");
    await act(async () => trigger?.click());
    await act(async () => document.activeElement?.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    ));

    expect(document.querySelector("[role=dialog]")).toBeNull();
    expect(onColorChange).not.toHaveBeenCalled();
    await act(async () => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(document.activeElement).toBe(trigger);
  });

});
