import { act, type ContextType } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Competences from "./competences";
import { AuthContext } from "../../../../store/AuthProvider";

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

  const renderCompetences = async (rank = 0) => {
    await act(async () => {
      root.render(
        <AuthContext.Provider
          value={{ user: { roles: [{ rank }] } } as ContextType<typeof AuthContext>}
        >
          <MemoryRouter initialEntries={["/parcours/42"]}>
            <Routes>
              <Route path="/parcours/:id" element={<Competences />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>,
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

  it("réduit l'opacité uniquement des badges non acquis par l'étudiant", async () => {
    mockUseParcoursSkills.mockReturnValue({
      skills: [
        { id: 1, description: "À obtenir", badge: "one.png", isEarned: false },
        { id: 2, description: "Obtenu", badge: "two.png", isEarned: true },
      ],
    });
    await renderCompetences(3);
    const badges = container.querySelectorAll("img");
    expect(badges[0].classList.contains("opacity-30")).toBe(true);
    expect(badges[1].classList.contains("opacity-100")).toBe(true);
    await renderCompetences(2);
    expect(
      [...container.querySelectorAll("img")].every((badge) =>
        badge.classList.contains("opacity-100"),
      ),
    ).toBe(true);
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
