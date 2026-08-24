import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router";
import { AuthContext } from "../../store/AuthProvider";
import { AbilityContext } from "../../rbac/AbilityProvider";
import { createAppAbility } from "../../rbac/ability";
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
              user: { id: 1 },
              isLoggedIn: true,
              isAppInitialized: true,
            } as never
          }
        >
          <AbilityContext
            value={createAppAbility([{ action: "layout", subject: "student" }])}
          >
            <MemoryRouter initialEntries={["/student/parcours/module/1"]}>
              <Routes>
                <Route
                  path="/student"
                  element={<RouteGuard layout="student" />}
                >
                  <Route
                    path="parcours/module/:moduleId"
                    element={<p>page-module</p>}
                  />
                </Route>
                <Route path="/access-denied" element={<p>page-refus</p>} />
              </Routes>
            </MemoryRouter>
          </AbilityContext>
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
});
