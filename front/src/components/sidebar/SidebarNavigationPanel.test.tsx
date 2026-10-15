import { act } from "react";
import { createPortal } from "react-dom";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import SidebarMobile from "./SidebarMobile";
import { MobileHeaderActionsProvider } from "../../store/MobileHeaderActionsProvider";
import { useMobileNavigationPanel } from "../../hooks/useMobileNavigationPanel";

vi.mock("./SidebarWrapper", () => ({ default: () => null }));
vi.mock("./SidebarLogo", () => ({ default: () => <svg /> }));
vi.mock("../../store/VisualPreferences", () => ({
  useVisualPreferences: () => ({ animations: false }),
}));

vi.mock("../../hooks/useInstanceBranding", () => ({
  useInstanceBranding: () => ({ logoUrl: null, backgroundColor: undefined, websiteUrl: null }),
}));

const roots: Root[] = [];

const mockViewport = (isMobile: boolean) => {
  window.matchMedia = ((query: string) => ({
    matches: isMobile && query.includes("max-width"),
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  })) as unknown as typeof window.matchMedia;
};

const Page = ({ label }: { label: string | null }) => {
  const panel = useMobileNavigationPanel(label);
  return (
    <>
      <p>Contenu de la page</p>
      {panel.container &&
        createPortal(
          <button type="button" onClick={panel.close}>
            Activité 1
          </button>,
          panel.container,
        )}
    </>
  );
};

const renderBar = (label: string | null = "Navigation du module") => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  roots.push(root);
  const render = (nextLabel: string | null) =>
    act(() => {
      root.render(
        <MemoryRouter initialEntries={["/admin/parcours"]}>
          <MobileHeaderActionsProvider>
            <SidebarMobile interfaceType="admin">
              <a href="/admin/group">Groupes</a>
            </SidebarMobile>
            <Page label={nextLabel} />
          </MobileHeaderActionsProvider>
        </MemoryRouter>,
      );
    });
  render(label);
  return { container, render };
};

const openButton = () =>
  document.querySelector<HTMLButtonElement>(
    'button[aria-label="Ouvrir : Navigation du module"]',
  );

// Le tiroir d'actions reste monté, fermé : on cible le panneau par son nom.
const panel = () =>
  document.querySelector('[role="dialog"][aria-label="Navigation du module"]');

// La sortie du panneau est animée : le retrait du DOM arrive après quelques images.
const settle = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

afterEach(() => {
  roots.splice(0).forEach((root) => act(() => root.unmount()));
  document.body.innerHTML = "";
});

describe("Panneau de navigation plein écran de la barre mobile", () => {
  it("n'affiche pas le bouton sans page qui propose un panneau", () => {
    mockViewport(true);
    renderBar(null);

    expect(openButton()).toBeNull();
  });

  it("n'affiche pas le bouton hors mobile", () => {
    mockViewport(false);
    renderBar();

    expect(openButton()).toBeNull();
  });

  it("ouvre la navigation de la page en plein écran depuis la barre du haut", () => {
    mockViewport(true);
    renderBar();

    expect(openButton()?.getAttribute("aria-expanded")).toBe("false");
    expect(panel()).toBeNull();

    act(() => openButton()!.click());

    const dialog = panel();
    expect(dialog?.getAttribute("aria-label")).toBe("Navigation du module");
    expect(dialog?.getAttribute("aria-modal")).toBe("true");
    expect(dialog?.textContent).toContain("Activité 1");
    expect(document.activeElement?.getAttribute("aria-label")).toBe("Fermer la navigation");
  });

  it("se ferme avec le bouton, Échap ou depuis la page", async () => {
    mockViewport(true);
    renderBar();

    act(() => openButton()!.click());
    act(() =>
      document
        .querySelector<HTMLButtonElement>('button[aria-label="Fermer la navigation"]')!
        .click(),
    );
    await settle();
    expect(panel()).toBeNull();

    act(() => openButton()!.click());
    act(() => {
      panel()!.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    await settle();
    expect(panel()).toBeNull();

    act(() => openButton()!.click());
    act(() => {
      Array.from(document.querySelectorAll("button"))
        .find((button) => button.textContent === "Activité 1")!
        .click();
    });
    await settle();
    expect(panel()).toBeNull();
  });

  it("referme le panneau et retire le bouton quand la page ne le propose plus", async () => {
    mockViewport(true);
    const { render } = renderBar();

    act(() => openButton()!.click());
    render(null);
    await settle();

    expect(panel()).toBeNull();
    expect(openButton()).toBeNull();
  });
});
