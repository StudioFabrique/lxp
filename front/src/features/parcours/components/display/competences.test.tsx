import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Competences from "./competences";

const { mockUseParcoursSkills } = vi.hoisted(() => ({
  mockUseParcoursSkills: vi.fn(),
}));

vi.mock("../../hooks/useParcoursSkills", () => ({
  useParcoursSkills: mockUseParcoursSkills,
}));

describe("Compétences dans l'aperçu du parcours", () => {
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
    vi.clearAllMocks();
  });

  const renderCompetences = async () => {
    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={["/parcours/42"]}>
          <Routes>
            <Route path="/parcours/:id" element={<Competences />} />
          </Routes>
        </MemoryRouter>,
      );
    });
  };

  it("affiche le badge avec l'intitulé de chaque compétence", async () => {
    mockUseParcoursSkills.mockReturnValue({
      skills: [
        {
          id: 1,
          description: "Communiquer efficacement",
          badge: "data:image/png;base64,skill-badge",
        },
      ],
    });

    await renderCompetences();

    const skill = container.querySelector("li");
    const badge = skill?.querySelector("img");

    expect(skill?.textContent).toContain("Communiquer efficacement");
    expect(badge?.getAttribute("src")).toBe(
      "data:image/png;base64,skill-badge",
    );
    expect(badge?.getAttribute("alt")).toBe("Communiquer efficacement");
  });

  it("affiche un trophée de repli lorsqu'une compétence n'a pas de badge", async () => {
    mockUseParcoursSkills.mockReturnValue({
      skills: [{ id: 2, description: "Travailler en équipe" }],
    });

    await renderCompetences();

    expect(container.querySelector("li svg")).not.toBeNull();
    expect(container.textContent).toContain("Travailler en équipe");
  });
});
