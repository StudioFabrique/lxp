import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router";
import { AuthContext } from "../../store/AuthProvider";
import { DEFAULT_DEMO_CONFIG, DemoContext } from "../../store/DemoContext";
import RouteGuard from "./RouteGuard";

let container: HTMLDivElement;
let root: Root;

const renderGuard = async (isConfigLoaded: boolean, demoMode = true) => {
  await act(async () => {
    root.render(
      <DemoContext value={{ ...DEFAULT_DEMO_CONFIG, demoMode, isConfigLoaded }}>
        <AuthContext
          value={
            {
              user: { id: 1, roles: [{ rank: 3 }] },
              isLoggedIn: true,
              isAppInitialized: true,
            } as never
          }
        >
          <MemoryRouter initialEntries={["/student/parcours/module/1"]}>
              <Routes>
                <Route
                  path="/student"
                  element={<RouteGuard area="student" />}
                >
                  <Route
                    path="parcours/module/:moduleId"
                    element={<p>page-module</p>}
                  />
                </Route>
                <Route path="/access-denied" element={<p>page-refus</p>} />
              </Routes>
          </MemoryRouter>
        </AuthContext>
      </DemoContext>,
    );
  });

  return container.textContent ?? "";
};

const renderAdminGuard = async (
  rank: number,
) => {
  await act(async () => {
    root.render(
      <DemoContext
        value={{ ...DEFAULT_DEMO_CONFIG, demoMode: false, isConfigLoaded: true }}
      >
        <AuthContext
          value={
            {
              user: { id: 1, roles: [{ rank }] },
              isLoggedIn: true,
              isAppInitialized: true,
            } as never
          }
        >
          <MemoryRouter initialEntries={["/admin/dashboard"]}>
              <Routes>
                <Route
                  path="/admin"
                  element={<RouteGuard area="staff" />}
                >
                  <Route path="dashboard" element={<p>page-admin</p>} />
                </Route>
                <Route path="/access-denied" element={<p>page-refus</p>} />
              </Routes>
          </MemoryRouter>
        </AuthContext>
      </DemoContext>,
    );
  });

  return container.textContent ?? "";
};

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

describe("RouteGuard", () => {
  it("attend la configuration d'exécution avant de monter la page", async () => {
    // Sans cette attente, la page se monterait avec `demoMode` et `aiDisabled`
    // encore à faux : génération IA lancée et écritures tentées sur l'instance
    // de démonstration.
    expect(await renderGuard(false)).not.toContain("page-module");
  });

  it("monte la page une fois la configuration connue", async () => {
    expect(await renderGuard(true)).toContain("page-module");
  });

  it.each([1, 2])(
    "accepte l'espace d'administration pour le rang %s",
    async (rank) => {
      expect(await renderAdminGuard(rank)).toContain("page-admin");
    },
  );

  it("refuse l'espace d'administration à un apprenant", async () => {
    expect(await renderAdminGuard(3)).toContain("page-refus");
  });
});
