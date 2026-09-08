import { act, type ContextType } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, expect, it } from "vitest";
import { AuthContext } from "../../store/AuthProvider";
import SkillBadge from "./skill-badge";
import type Skill from "../../utils/interfaces/skill";

const skill: Skill = {
  id: 1,
  description: "Communiquer",
  isEarned: false,
  completedModules: 1,
  totalModules: 2,
  modules: [
    { id: 10, title: "Les bases", progress: 100, isCompleted: true },
    { id: 20, title: "La pratique", progress: 50, isCompleted: false },
  ],
};
let root: Root;
let container: HTMLDivElement;

function render(rank = 3, inModal = false) {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user: { roles: [{ rank }] } } as ContextType<typeof AuthContext>}>
        <SkillBadge skill={skill} inModal={inModal} />
      </AuthContext.Provider>
    </MemoryRouter>,
  ));
}

afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
});

it("ouvre les modules associés au clic, affiche les compteurs et referme au clavier", () => {
  render();
  expect(container.querySelector("progress")?.value).toBe(1);
  expect(container.querySelector("progress")?.max).toBe(2);
  const trigger = container.querySelector("button")!;
  act(() => trigger.click());
  const dialog = document.body.querySelector("dialog")!;
  expect(dialog.textContent).toContain("Terminé");
  expect(dialog.textContent).toContain("À terminer · 50 %");
  expect(dialog.querySelector('a[href="/student/parcours/module/20"]')?.textContent).toBe("La pratique");
  expect(dialog.querySelector('[aria-haspopup="dialog"]')).toBeNull();
  act(() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
  expect(document.body.querySelector("dialog")).toBeNull();
  expect(document.activeElement).toBe(trigger);
});

it("ne propose pas de modale aux formateurs", () => {
  render(2);
  expect(container.querySelector("button")).toBeNull();
  expect(container.querySelector("progress")).toBeNull();
});

it("conserve la progression dans une modale sans rendre le badge cliquable", () => {
  render(3, true);
  expect(container.querySelector("progress")?.value).toBe(1);
  expect(container.querySelector("button")).toBeNull();
});
