import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router";
import { AuthContext } from "../../store/AuthProvider";
import { AbilityContext } from "../../rbac/AbilityProvider";
import { createAppAbility } from "../../rbac/ability";
import { DEFAULT_DEMO_CONFIG, DemoContext } from "../../store/DemoContext";
import { onboardingApi } from "../../features/auth/api/onboarding.api";
import LoginGuard from "./LoginGuard";

vi.mock("../../features/auth/api/onboarding.api", () => ({
  onboardingApi: { getSetupStatus: vi.fn() },
}));

const getSetupStatus = vi.mocked(onboardingApi.getSetupStatus);

let container: HTMLDivElement;
let root: Root;

/**
 * Rend le guard sur une adresse donnée, avec des routes témoins : on lit la
 * destination atteinte plutôt que d'inspecter le `Navigate` rendu.
 */
const renderAt = async (path: string, demoMode: boolean) => {
  await act(async () => {
    root.render(
      <DemoContext
        value={{ ...DEFAULT_DEMO_CONFIG, demoMode, isConfigLoaded: true }}
      >
        <AuthContext
          value={
            {
              user: null,
              isLoggedIn: false,
              isAppInitialized: true,
            } as never
          }
        >
          <AbilityContext value={createAppAbility([])}>
            <MemoryRouter initialEntries={[path]}>
              <Routes>
                <Route element={<LoginGuard />}>
                  <Route path="/login" element={<p>page-connexion</p>} />
                  <Route path="/register" element={<p>page-inscription</p>} />
                  <Route path="/init" element={<p>page-premier-admin</p>} />
                  <Route path="/createRoot" element={<p>page-nouveau-root</p>} />
                  <Route path="/confirm-email" element={<p>page-email</p>} />
                </Route>
                <Route path="/demo" element={<p>page-demo</p>} />
              </Routes>
            </MemoryRouter>
          </AbilityContext>
        </AuthContext>
      </DemoContext>,
    );
  });

  return container.textContent ?? "";
};

describe("LoginGuard", () => {
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    getSetupStatus.mockReset();
    getSetupStatus.mockResolvedValue({
      hasAdmins: true,
      activationTokenTtlMinutes: 30,
    });
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it.each(["/login", "/register", "/init", "/createRoot", "/confirm-email"])(
    "renvoie %s vers l'entrée de démonstration",
    async (path) => {
      expect(await renderAt(path, true)).toBe("page-demo");
    },
  );

  it("laisse le formulaire de connexion sur une instance ordinaire", async () => {
    expect(await renderAt("/login", false)).toBe("page-connexion");
  });

  it("conduit au premier administrateur quand aucun compte n'existe", async () => {
    getSetupStatus.mockResolvedValue({
      hasAdmins: false,
      activationTokenTtlMinutes: 30,
    });

    expect(await renderAt("/login", false)).toBe("page-premier-admin");
  });

  it.each([
    ["/createRoot", "page-nouveau-root"],
    ["/confirm-email", "page-email"],
  ])(
    "laisse accessible le lien public %s quand des administrateurs existent",
    async (path, expected) => {
      expect(await renderAt(path, false)).toBe(expected);
    },
  );
});
