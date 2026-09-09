import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type Module from "../../../../../utils/interfaces/module";
import ContenuItem from "./contenu-item";

const module = {
  id: 1,
  title: "Architecture applicative et développement des composants métier",
  description: "",
  contacts: [],
  bonusSkills: [],
  duration: 1,
  parcours: {},
  courses: [],
  tags: [],
} as unknown as Module;

describe("Élément du contenu du parcours", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
  });

  it("laisse la ligne grandir lorsque le titre occupe plusieurs lignes", async () => {
    await act(async () => {
      root.render(
        <MemoryRouter>
          <ContenuItem
            module={module}
            iterationCount={1}
            selectedModuleId={module.id}
            setSelectedModule={vi.fn()}
          />
        </MemoryRouter>,
      );
    });

    const row = container.querySelector<HTMLElement>(
      '[data-testid="contenu-item"]',
    );
    const date = row?.children[0];
    const content = row?.children[1];
    const title = content?.querySelector("p:last-child");

    expect(row?.classList.contains("items-stretch")).toBe(true);
    expect(date?.classList.contains("min-h-20")).toBe(true);
    expect(date?.classList.contains("h-20")).toBe(false);
    expect(content?.classList.contains("min-h-20")).toBe(true);
    expect(content?.classList.contains("h-20")).toBe(false);
    expect(title?.classList.contains("wrap-break-word")).toBe(true);
  });
});
