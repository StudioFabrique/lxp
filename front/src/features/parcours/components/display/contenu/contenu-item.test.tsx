import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import type Module from "../../../../../utils/interfaces/module";
import ContenuItem from "./contenu-item";

const moduleData = (courses: Module["courses"]) => ({
  id: 12,
  title: "Module test",
  courses,
}) as Module;

const renderItem = (module: Module, isStudent = true) => renderToStaticMarkup(
  <MemoryRouter>
    <ContenuItem
      module={module}
      isStudent={isStudent}
      iterationCount={1}
      selectedModuleId={undefined}
      setSelectedModule={vi.fn()}
    />
  </MemoryRouter>,
);

describe("Module dans l'aperçu du parcours", () => {
  it("affiche un cadenas sans lien quand le module est vide", () => {
    const markup = renderItem(moduleData([]));

    expect(markup).toContain("Module test");
    expect(markup).toContain("Aucun contenu disponible dans ce module");
    expect(markup).not.toContain("href=");
  });

  it("conserve l'accès à un module qui contient un cours", () => {
    const markup = renderItem(moduleData([{} as Module["courses"][number]]));

    expect(markup).toContain('href="/module/12"');
  });

  it("laisse les rôles supérieurs ouvrir un module vide", () => {
    const markup = renderItem(moduleData([]), false);

    expect(markup).toContain('href="/module/12"');
    expect(markup).not.toContain("Aucun contenu disponible dans ce module");
  });

  it("ne sélectionne pas un module vide lorsque l'apprenant clique dessus", async () => {
    const container = document.createElement("div");
    const root = createRoot(container);
    const setSelectedModule = vi.fn();

    await act(async () => {
      root.render(
        <MemoryRouter>
          <ContenuItem
            module={moduleData([])}
            isStudent
            iterationCount={1}
            selectedModuleId={undefined}
            setSelectedModule={setSelectedModule}
          />
        </MemoryRouter>,
      );
    });

    await act(async () => {
      container.querySelector<HTMLElement>('[data-testid="contenu-item"]')?.click();
    });
    expect(setSelectedModule).not.toHaveBeenCalled();
    await act(async () => root.unmount());
  });
});
