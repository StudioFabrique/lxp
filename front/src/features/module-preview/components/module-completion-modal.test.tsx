import { act, type ContextType } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { expect, it, vi } from "vitest";
import { AuthContext } from "../../../store/AuthProvider";
import ModuleCompletionModal from "./module-completion-modal";

vi.mock("react-confetti", () => ({ default: () => null }));

it("affiche les badges obtenus et restants avec leurs modules sans ouvrir de seconde modale", () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  const module = { id: 1, title: "Introduction", progress: 100, isCompleted: true };
  try {
    act(() => root.render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: { roles: [{ rank: 3 }] } } as ContextType<typeof AuthContext>}>
          <ModuleCompletionModal moduleTitle="Introduction" onClose={vi.fn()} badges={[
            { id: 1, description: "Acquis", isEarned: true, completedModules: 1, totalModules: 1, modules: [module] },
            { id: 2, description: "À obtenir", isEarned: false, completedModules: 1, totalModules: 2, modules: [module, { id: 2, title: "Approfondissement", progress: 0, isCompleted: false }] },
          ]} />
        </AuthContext.Provider>
      </MemoryRouter>,
    ));
    expect(container.querySelector('ul[aria-label="Badges obtenus"]')?.textContent).toContain("Acquis");
    const remaining = container.querySelector('ul[aria-label="Badges restant à obtenir"]');
    expect(remaining?.textContent).toContain("Approfondissement");
    expect(remaining?.textContent).toContain("Introduction");
    expect(container.querySelectorAll("progress")).toHaveLength(2);
    expect(container.querySelector('[aria-haspopup="dialog"]')).toBeNull();
  } finally {
    act(() => root.unmount());
  }
});
