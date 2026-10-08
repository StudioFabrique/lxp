import { act, type ContextType } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AuthContext } from "../../store/AuthProvider";
import { DEFAULT_DEMO_CONFIG, DemoContext } from "../../store/DemoContext";
import type User from "../../utils/interfaces/user";
import type { OnboardingStatus } from "../../utils/interfaces/user";
import IntroPresentationGate from "./IntroPresentationGate";
import { IntroPresentationProvider } from "./IntroPresentationProvider";
import { useIntroPresentation } from "./useIntroPresentation";

const mocks = vi.hoisted(() => ({ toastError: vi.fn() }));

vi.mock("react-hot-toast", () => ({ default: { error: mocks.toastError } }));
vi.mock("./IntroPresentation", () => ({
  default: ({
    isSaving,
    onSkip,
    onComplete,
  }: {
    isSaving: boolean;
    onSkip: () => void;
    onComplete: () => void;
  }) => (
    <div data-testid="presentation" data-saving={isSaving}>
      <button type="button" onClick={onSkip}>skip</button>
      <button type="button" onClick={onComplete}>complete</button>
    </div>
  ),
}));

vi.mock("./IntroRoleReveal", () => ({
  default: ({ onDone }: { onDone: () => void }) => (
    <div data-testid="role-reveal">
      <button type="button" onClick={onDone}>reveal-done</button>
    </div>
  ),
}));

const updateOnboarding = vi.fn();

const authValue = (status?: OnboardingStatus): ContextType<typeof AuthContext> => ({
  user: {
    _id: "1",
    onboarding: status ? { status, step: "", version: 1 } : undefined,
  } as User,
  isLoggedIn: true,
  isAppInitialized: true,
  isLoading: false,
  error: "",
  activationRequired: false,
  activationRetryAfterSeconds: 0,
  roles: [],
  socket: null,
  login: vi.fn(),
  logout: vi.fn(),
  handshake: vi.fn(),
  fetchRoles: vi.fn(),
  updateOnboarding,
});

const ReopenButton = () => {
  const { open } = useIntroPresentation();
  return <button type="button" onClick={open}>reopen</button>;
};

let container: HTMLDivElement;
let root: Root;

const render = ({
  status = "pending",
  path = "/admin/dashboard",
  eligible = true,
  demo = false,
}: {
  status?: OnboardingStatus;
  path?: string;
  eligible?: boolean;
  demo?: boolean;
} = {}) =>
  act(() =>
    root.render(
      <DemoContext value={{ ...DEFAULT_DEMO_CONFIG, demoMode: demo, isConfigLoaded: true }}>
        <AuthContext value={authValue(status)}>
          <MemoryRouter initialEntries={[path]}>
            <IntroPresentationProvider isEligible={eligible}>
              <ReopenButton />
              <IntroPresentationGate>
                <p data-testid="page">page</p>
              </IntroPresentationGate>
            </IntroPresentationProvider>
          </MemoryRouter>
        </AuthContext>
      </DemoContext>,
    ),
  );

const click = async (label: string) => {
  const button = Array.from(container.querySelectorAll("button")).find(
    (item) => item.textContent === label,
  );
  await act(async () => button?.click());
};

const isOpen = () => container.querySelector('[data-testid="presentation"]') !== null;
const isRevealShown = () => container.querySelector('[data-testid="role-reveal"]') !== null;
const isPageShown = () => container.querySelector('[data-testid="page"]') !== null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  updateOnboarding.mockReset().mockResolvedValue({ status: "skipped", step: "", version: 1 });
  mocks.toastError.mockReset();
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe("IntroPresentationProvider", () => {
  it("s'ouvre seule sur le dashboard, à la place de la page", () => {
    render();
    expect(isOpen()).toBe(true);
    expect(isPageShown()).toBe(false);
  });

  it("reste fermée hors du dashboard, déjà vue, non éligible ou en démonstration", () => {
    render({ path: "/admin/parcours" });
    expect(isOpen()).toBe(false);
    expect(isPageShown()).toBe(true);
    render({ status: "skipped" });
    expect(isOpen()).toBe(false);
    render({ status: "completed" });
    expect(isOpen()).toBe(false);
    render({ eligible: false });
    expect(isOpen()).toBe(false);
    render({ demo: true });
    expect(isOpen()).toBe(false);
  });

  it("enregistre « ignorée » auprès du serveur", async () => {
    render();
    await click("skip");

    expect(updateOnboarding).toHaveBeenCalledWith("skipped");
  });

  it("enregistre « terminée » quand la présentation est terminée", async () => {
    render();
    await click("complete");

    expect(updateOnboarding).toHaveBeenCalledWith("completed");
  });

  it("reste ouverte et prévient si l'enregistrement échoue", async () => {
    updateOnboarding.mockRejectedValue(new Error("réseau"));
    render();
    await click("skip");

    expect(isOpen()).toBe(true);
    expect(mocks.toastError).toHaveBeenCalledWith(
      "Impossible d'enregistrer votre choix. Réessayez.",
    );
  });

  it("se rouvre à la demande sans rien enregistrer une fois déjà vue", async () => {
    render({ status: "completed" });
    await click("reopen");
    expect(isOpen()).toBe(true);

    await click("skip");

    expect(updateOnboarding).not.toHaveBeenCalled();
    expect(isOpen()).toBe(false);
  });

  it("n'enregistre rien en démonstration", async () => {
    render({ demo: true });
    await click("reopen");
    await click("complete");

    expect(updateOnboarding).not.toHaveBeenCalled();
    expect(isOpen()).toBe(false);
  });

  it("enchaîne la découverte du rôle une fois le choix enregistré", async () => {
    render();
    await click("skip");
    // Le serveur a confirmé : le compte n'est plus en attente.
    await render({ status: "skipped" });

    expect(isOpen()).toBe(false);
    expect(isRevealShown()).toBe(true);
    expect(isPageShown()).toBe(false);

    await click("reveal-done");

    expect(isRevealShown()).toBe(false);
    expect(isPageShown()).toBe(true);
  });

  it("ne lance pas la découverte du rôle si l'enregistrement échoue, ni après une réouverture", async () => {
    updateOnboarding.mockRejectedValue(new Error("réseau"));
    render();
    await click("skip");
    expect(isRevealShown()).toBe(false);

    render({ status: "completed" });
    await click("reopen");
    await click("skip");
    expect(isRevealShown()).toBe(false);
    expect(isPageShown()).toBe(true);
  });
});
