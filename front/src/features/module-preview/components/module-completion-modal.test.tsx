import { act, type ContextType } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, useLocation } from "react-router";
import { expect, it, vi } from "vitest";
import { AuthContext } from "../../../store/AuthProvider";
import ModuleCompletionModal from "./module-completion-modal";

vi.mock("react-confetti", () => ({ default: () => null }));

function CurrentPath() {
  return <span data-testid="current-path">{useLocation().pathname}</span>;
}

it("affiche les modules uniquement sous les badges restant à obtenir", () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  const onClose = vi.fn();
  const module = { id: 1, title: "Introduction", progress: 100, isCompleted: true };
  try {
    act(() => root.render(
      <MemoryRouter initialEntries={["/student/parcours/module/1"]}>
        <AuthContext.Provider value={{ user: { roles: [{ rank: 3 }] } } as ContextType<typeof AuthContext>}>
          <CurrentPath />
          <ModuleCompletionModal parcoursId={42} onClose={onClose} badges={[
            { id: 1, description: "Acquis", isEarned: true, completedModules: 1, totalModules: 1, modules: [module] },
            { id: 2, description: "À obtenir", isEarned: false, completedModules: 1, totalModules: 2, modules: [module, { id: 2, title: "Approfondissement", progress: 0, isCompleted: false }] },
          ]} />
        </AuthContext.Provider>
      </MemoryRouter>,
    ));
    const earned = container.querySelector('ul[aria-label="Badges obtenus"]');
    expect(earned?.textContent).toContain("Acquis");
    expect(earned?.querySelector('ul[aria-label^="Modules associés"]')).toBeNull();
    const remaining = container.querySelector('ul[aria-label="Badges restant à obtenir"]');
    expect(remaining?.textContent).toContain("Approfondissement");
    expect(remaining?.textContent).toContain("Introduction");
    expect(container.querySelectorAll("progress")).toHaveLength(2);
    expect(container.querySelector('[aria-haspopup="dialog"]')).toBeNull();
    const returnButton = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent === "Retour au parcours",
    );
    expect(returnButton).toBeDefined();
    act(() => returnButton?.click());
    expect(onClose).toHaveBeenCalledOnce();
    expect(container.querySelector('[data-testid="current-path"]')?.textContent).toBe("/student/parcours/view/42");
  } finally {
    act(() => root.unmount());
  }
});
