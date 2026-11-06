import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  MobileHeaderActionsContext,
  type MobileHeaderActions,
} from "../../../store/MobileHeaderActionsProvider";
import RecommendedActions from "./recommended-actions";
import {
  recommendedActionIcons,
  type RecommendedAction,
} from "./recommended-action-config";

const actions: RecommendedAction[] = [
  {
    id: "teachers",
    title: "Inviter l'équipe pédagogique",
    description: "Créer un formateur",
    to: "/teachers",
    icon: recommendedActionIcons.inviteTeachers,
  },
  {
    id: "admin",
    title: "Créer un administrateur",
    description: "Créer un administrateur hors root",
    to: "/admin",
    icon: recommendedActionIcons.createAdmin,
  },
  {
    id: "logo",
    title: "Changer le logo de l'organisme",
    description: "Personnaliser la plateforme",
    to: "/logo",
    icon: recommendedActionIcons.changeLogo,
  },
];

describe("RecommendedActions", () => {
  let root: Root | null = null;
  let container: HTMLDivElement;

  const render = (props: Partial<Parameters<typeof RecommendedActions>[0]> = {}) => {
    act(() => {
      root = createRoot(container);
      root.render(
        <MemoryRouter>
          <RecommendedActions userId="root-id" actions={actions} {...props} />
        </MemoryRouter>,
      );
    });
  };

  const bellButton = () =>
    container.querySelector<HTMLButtonElement>(
      'button[aria-label^="Actions recommandées"]',
    );

  beforeEach(() => {
    localStorage.clear();
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (root) act(() => root?.unmount());
    root = null;
    container.remove();
    localStorage.clear();
  });

  it("affiche un bouton de notification avec le nombre d'actions", () => {
    render();

    expect(bellButton()?.getAttribute("aria-label")).toBe(
      "Actions recommandées, 3 à réaliser",
    );
    expect(bellButton()?.textContent).toContain("3");
  });

  it("n'affiche rien pendant le chargement ou sans action", () => {
    render({ isLoading: true });
    expect(bellButton()).toBeNull();

    act(() => root?.unmount());
    render({ actions: [] });
    expect(bellButton()).toBeNull();
  });

  it("liste les actions dans l'ordre fourni dans le tiroir", () => {
    render();
    act(() => bellButton()?.click());

    const links = Array.from(
      document.body.querySelectorAll<HTMLAnchorElement>(
        `#recommended-actions-drawer ~ .drawer-side ol a`,
      ),
    ).map((link) => link.getAttribute("href"));
    expect(links).toEqual(actions.map((action) => action.to));
  });

  it("masque durablement le bouton pour l'utilisateur courant", () => {
    render({ userId: "teacher-id" });
    act(() => bellButton()?.click());

    const skipButton = document.body.querySelector<HTMLButtonElement>(
      'button[aria-label="Masquer les actions recommandées"]',
    );
    act(() => skipButton?.click());

    expect(bellButton()).toBeNull();
    expect(
      localStorage.getItem("lxp:recommended-actions:hidden:teacher-id"),
    ).toBe("true");
  });

  it("sur mobile, place la cloche seule dans l'en-tête du tiroir d'actions", () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query.includes("max-width"),
      media: query,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    })) as unknown as typeof window.matchMedia;
    const slot = document.createElement("div");
    document.body.appendChild(slot);
    const noop = () => undefined;
    const value: MobileHeaderActions = {
      container: null,
      setContainer: noop,
      headerContainer: slot,
      setHeaderContainer: noop,
      topBarTitle: null,
      setTopBarTitle: noop,
      navigation: null,
      setNavigation: noop,
      isNavigationOpen: false,
      setIsNavigationOpen: noop,
      navigationContainer: null,
      setNavigationContainer: noop,
    };
    act(() => {
      root = createRoot(container);
      root.render(
        <MemoryRouter>
          <MobileHeaderActionsContext value={value}>
            <RecommendedActions userId="root-id" actions={actions} />
          </MobileHeaderActionsContext>
        </MemoryRouter>,
      );
    });

    const bell = slot.querySelector('button[aria-label^="Actions recommandées"]');
    expect(bell).not.toBeNull();
    expect(bell?.textContent).toBe("3");
    expect(container.querySelector('button[aria-label^="Actions recommandées"]')).toBeNull();

    window.matchMedia = originalMatchMedia;
    slot.remove();
  });
});
