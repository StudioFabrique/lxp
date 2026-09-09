import { act, type ContextType } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AuthContext } from "../../../../store/AuthProvider";
import Skills from "./skills";

describe("Badges de compétences du profil apprenant", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it("affiche les badges et leur progression", () => {
    act(() => {
      root.render(
        <MemoryRouter>
          <AuthContext.Provider
            value={{ user: { roles: [{ rank: 3 }] } } as ContextType<typeof AuthContext>}
          >
            <Skills
              skillData={[
                {
                  id: 1,
                  description: "Communiquer efficacement",
                  badge: "badge.png",
                  completedModules: 1,
                  totalModules: 2,
                  isEarned: false,
                },
              ]}
            />
          </AuthContext.Provider>
        </MemoryRouter>,
      );
    });

    expect(container.querySelector("img")?.getAttribute("src")).toBe(
      "badge.png",
    );
    expect(container.textContent).toContain("Communiquer efficacement");
    expect(container.textContent).toContain("1/2");
  });

  it("affiche un état vide explicite", () => {
    act(() => {
      root.render(<Skills skillData={[]} />);
    });

    expect(container.textContent).toContain(
      "Aucun badge de compétence pour le moment.",
    );
  });
});
