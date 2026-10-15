import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import CourseContentTagCombobox from "./course-content-tag-combobox";

const tags = [
  { id: 1, name: "sécurité des personnes", color: "#ff0000" },
  { id: 2, name: "développement durable", color: "#00ff00" },
  { id: 3, name: "tarification", color: "#0000ff" },
];

describe("CourseContentTagCombobox", () => {
  let root: Root;
  let container: HTMLDivElement;
  const onChange = vi.fn();

  const renderCombobox = (value = 0) => {
    act(() => {
      root = createRoot(container);
      root.render(
        <CourseContentTagCombobox tags={tags} value={value} onChange={onChange} />,
      );
    });
  };
  const input = () =>
    container.querySelector<HTMLInputElement>('input[role="combobox"]')!;
  const options = () =>
    Array.from(document.body.querySelectorAll('[role="option"]')).map(
      (option) => option.textContent,
    );
  const type = (text: string) => {
    act(() => {
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )!.set!;
      setter.call(input(), text);
      input().dispatchEvent(new Event("input", { bubbles: true }));
    });
  };

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    onChange.mockClear();
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it("propose tous les tags à l'ouverture", () => {
    renderCombobox();
    act(() => input().focus());

    expect(options()).toEqual([
      "Tous les tags",
      "sécurité des personnes",
      "développement durable",
      "tarification",
    ]);
  });

  it("filtre les tags en tapant, sans tenir compte des accents ni de la casse", () => {
    renderCombobox();
    act(() => input().focus());
    type("SECURITE");

    expect(options()).toEqual(["sécurité des personnes"]);

    type("zzz");
    expect(document.body.textContent).toContain("Aucun tag trouvé.");
  });

  it("choisit un tag à la souris puis affiche son nom", () => {
    renderCombobox();
    act(() => input().focus());
    type("durable");
    act(() =>
      document.body
        .querySelector<HTMLElement>('[role="option"]')
        ?.click(),
    );

    expect(onChange).toHaveBeenCalledWith(2);
    expect(options()).toEqual([]);
  });

  it("choisit le tag actif au clavier et revient à tous les tags", () => {
    renderCombobox(3);
    act(() => input().focus());
    act(() => {
      input().dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }),
      );
    });
    act(() => {
      input().dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );
    });

    expect(onChange).toHaveBeenCalledWith(2);
  });
});
