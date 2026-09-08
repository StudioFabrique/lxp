import { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it } from "vitest";
import type Module from "../../../../utils/interfaces/module";
import ModuleData from "./module-data";

it("place les badges avant la description sans carte autour de la liste", () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  const module = {
    description: "Description test",
    bonusSkills: [{ id: 1, description: "Compétence", badge: "badge.png" }],
    contacts: [],
  } as unknown as Module;
  try {
    act(() => root.render(<ModuleData moduleData={module} />));
    const badges = container.querySelector('ul[aria-label="Badges du module"]');
    expect(badges).not.toBeNull();
    expect(container.firstElementChild?.firstElementChild).toBe(badges);
    expect(badges?.nextElementSibling?.textContent).toContain("Description test");
    expect(badges?.querySelector("img")?.getAttribute("src")).toBe("badge.png");
    expect(badges?.querySelector("[data-tip]")?.getAttribute("data-tip")).toBe(
      "Compétence",
    );
    expect(badges?.querySelector("[data-tip]")?.classList).toContain("tooltip");
    expect(badges?.querySelector("span:not(.sr-only)")).toBeNull();
    act(() => root.render(<ModuleData moduleData={{ ...module, bonusSkills: [] }} />));
    expect(container.querySelector('ul[aria-label="Badges du module"]')).toBeNull();
  } finally {
    act(() => root.unmount());
  }
});
