import { act, useState } from "react";
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
const AuthHarness = ({ children, initiallyLoggedIn, rank }: {
  children: React.ReactNode;
  initiallyLoggedIn: boolean;
  rank: number;
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(initiallyLoggedIn);
  return (
    <AuthContext value={{
      user: isLoggedIn ? { roles: [{ rank }] } : null,
      isLoggedIn,
      isAppInitialized: true,
      logout: async () => setIsLoggedIn(false),
    } as never}>
      {children}
    </AuthContext>
  );
};

const renderAt = async (
  path: string,
  demoMode: boolean,
  loggedIn = false,
  rank = 1,
) => {
  await act(async () => {
    root.render(
      <DemoContext
        value={{ ...DEFAULT_DEMO_CONFIG, demoMode, isConfigLoaded: true }}
      >
        <AuthHarness initiallyLoggedIn={loggedIn} rank={rank}>
          <AbilityContext value={createAppAbility([])}>
            <MemoryRouter initialEntries={[path]}>
              <Routes>
                <Route element={<LoginGuard />}>
                  <Route path="/login" element={<p>page-connexion</p>} />
                  <Route path="/register" element={<p>page-inscription</p>} />
                  <Route path="/init" element={<p>page-premier-admin</p>} />
                  <Route path="/createRoot" element={<p>page-nouveau-root</p>} />
                  <Route path="/confirm-email" element={<p>page-email</p>} />
                  <Route path="/instance-setup" element={<p>page-configuration</p>} />
                  <Route path="/student/onboarding" element={<p>page-onboarding</p>} />
                </Route>
                <Route path="/demo" element={<p>page-demo</p>} />
                <Route path="/admin" element={<p>tableau-de-bord</p>} />
                <Route path="/student" element={<p>espace-apprenant</p>} />
              </Routes>
            </MemoryRouter>
          </AbilityContext>
        </AuthHarness>
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

  it("affiche un chargement discret sur /init pendant la vérification", async () => {
    getSetupStatus.mockReturnValue(new Promise(() => {}));

    await renderAt("/init", false);

    expect(container.querySelector('[role="status"]')?.getAttribute("aria-label"))
      .toBe("Vérification de l'instance");
    expect(container.querySelector(".skeleton")).toBeNull();
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

  it("demande la déconnexion avant l'activation d'un autre compte", async () => {
    expect(await renderAt("/register?id=lien", false, true)).toContain(
      "Vous êtes déjà connectée",
    );
    expect(container.textContent).not.toContain("page-inscription");

    const confirm = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent?.includes("Confirmer la déconnexion"),
    );
    await act(async () => confirm?.click());
    expect(container.textContent).toContain("page-inscription");
  });

  it("revient au tableau de bord en annulant la déconnexion", async () => {
    await renderAt("/register?id=lien", false, true);
    const cancel = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent?.includes("Annuler"),
    );
    await act(async () => cancel?.click());
    expect(container.textContent).toContain("tableau-de-bord");
  });

  it("laisse le super administrateur configurer l'instance", async () => {
    expect(await renderAt("/instance-setup", false, true, 0)).toBe(
      "page-configuration",
    );
  });

  it("affiche l'onboarding dans le layout de connexion pour un apprenant connecté", async () => {
    expect(await renderAt("/student/onboarding", false, true, 3)).toBe(
      "page-onboarding",
    );
  });

  it("renvoie vers la connexion un visiteur qui ouvre l'onboarding", async () => {
    expect(await renderAt("/student/onboarding", false)).toBe("page-connexion");
  });

  it("renvoie les autres utilisateurs vers leur accueil", async () => {
    expect(await renderAt("/instance-setup", false, true)).toBe(
      "tableau-de-bord",
    );
  });
});
