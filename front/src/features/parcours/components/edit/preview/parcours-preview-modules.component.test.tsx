import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type Module from "../../../../../utils/interfaces/module";
import { useParcoursModules } from "../../../hooks/useParcoursModules";
import ParcoursPreviewModules from "./parcours-preview-modules.component";

vi.mock("../../../hooks/useParcoursModules", () => ({
  useParcoursModules: vi.fn(),
}));

vi.mock("../../../../../components/UI/cursor-glow-card", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const module = {
  id: 7,
  title: "Module illustré",
  description: "Description",
  duration: 3,
  contacts: [
    {
      id: 4,
      idMdb: "contact-4",
      firstname: "Ada",
      lastname: "Lovelace",
      role: "Formateur",
    },
  ],
  bonusSkills: [
    {
      id: 9,
      description: "Compétence illustrée",
      badge: "data:image/png;base64,skill-badge",
    },
  ],
  parcours: {},
  courses: [],
  tags: [],
} as unknown as Module;

describe("ParcoursPreviewModules", () => {
  beforeEach(() => {
    vi.mocked(useParcoursModules).mockReturnValue({
      modules: [module],
    } as ReturnType<typeof useParcoursModules>);
  });

  it("réutilise la carte module avec les affectations en lecture seule", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/admin/parcours/edit/12?step=7"]}>
        <Routes>
          <Route
            path="/admin/parcours/edit/:id"
            element={<ParcoursPreviewModules onEdit={vi.fn()} />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(markup).toContain("Module illustré");
    expect(markup).toContain("Ada Lovelace");
    expect(markup).toContain("skill-badge");
    expect(markup).toContain("Compétence illustrée");
    expect(markup).not.toContain("Affecter des ressources pédagogiques");
    expect(markup).not.toContain("Ajouter des compétences");
    expect(markup).not.toContain("Retirer la ressource pédagogique");
    expect(markup).not.toContain("Retirer la compétence");
    expect(markup).toContain("?step=4&amp;moduleId=7");
  });

  it("identifie les modules incomplets dans la liste", () => {
    vi.mocked(useParcoursModules).mockReturnValue({
      modules: [
        module,
        {
          ...module,
          id: 8,
          title: "Module sans compétence",
          bonusSkills: [],
        },
      ],
    } as ReturnType<typeof useParcoursModules>);

    const markup = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/admin/parcours/edit/12?step=7"]}>
        <Routes>
          <Route
            path="/admin/parcours/edit/:id"
            element={<ParcoursPreviewModules onEdit={vi.fn()} />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(markup).toContain("Module sans compétence");
    expect(markup.match(/>Incomplet</g)).toHaveLength(1);
    expect(markup).toContain("flex items-center gap-2");
  });

  it("redéclenche l'étape Modules à chaque clic sur Modifier", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    const onEdit = vi.fn();

    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={["/admin/parcours/edit/12?step=7"]}>
          <Routes>
            <Route
              path="/admin/parcours/edit/:id"
              element={<ParcoursPreviewModules onEdit={onEdit} />}
            />
          </Routes>
        </MemoryRouter>,
      );
    });

    const editLink = container.querySelector<HTMLAnchorElement>(
      '[aria-label="Modifier le module Module illustré"]',
    );
    await act(async () => editLink?.click());
    await act(async () => editLink?.click());

    expect(onEdit).toHaveBeenCalledTimes(2);
    expect(onEdit).toHaveBeenNthCalledWith(1, 4);
    expect(onEdit).toHaveBeenNthCalledWith(2, 4);

    await act(async () => root.unmount());
    container.remove();
  });

  it("ouvre la liste sans réactiver une ancienne sélection de module", async () => {
    const CurrentLocation = () => <output>{useLocation().search}</output>;
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    const onEdit = vi.fn();

    await act(async () => {
      root.render(
        <MemoryRouter
          initialEntries={[
            "/admin/parcours/edit/12?step=7&moduleId=7&create=true&keep=1",
          ]}
        >
          <CurrentLocation />
          <Routes>
            <Route
              path="/admin/parcours/edit/:id"
              element={<ParcoursPreviewModules onEdit={onEdit} />}
            />
          </Routes>
        </MemoryRouter>,
      );
    });

    const editButton = container.querySelector<HTMLButtonElement>(
      '[aria-label="Modifier la liste des modules"]',
    );
    await act(async () => editButton?.click());

    expect(onEdit).toHaveBeenCalledWith(4);
    expect(container.querySelector("output")?.textContent).toBe("?step=4&keep=1");

    await act(async () => root.unmount());
    container.remove();
  });
});
