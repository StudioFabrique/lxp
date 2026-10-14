import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import PageHeader from "./PageHeader";
import { MobileHeaderActionsProvider } from "../../store/MobileHeaderActionsProvider";
import { useMobileHeaderActions } from "../../hooks/useMobileHeaderActions";

vi.mock("./SidebarRouteIcon", () => ({ default: () => null }));

const roots: Root[] = [];

const ActionsHost = () => {
  const actions = useMobileHeaderActions();
  return <div data-testid="actions-host" ref={actions?.setContainer} />;
};

const mockViewport = (isMobile: boolean) => {
  window.matchMedia = ((query: string) => ({
    matches: isMobile && query.includes("max-width"),
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  })) as unknown as typeof window.matchMedia;
};

const renderPage = (withProvider = true) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  roots.push(root);
  const header = (
    <PageHeader title="Liste d'utilisateurs" description="Créez des comptes">
      <button type="button">Créer un utilisateur</button>
    </PageHeader>
  );
  act(() => {
    root.render(
      withProvider ? (
        <MobileHeaderActionsProvider>
          <ActionsHost />
          {header}
        </MobileHeaderActionsProvider>
      ) : (
        header
      ),
    );
  });
  return container;
};

afterEach(() => {
  roots.splice(0).forEach((root) => act(() => root.unmount()));
  document.body.innerHTML = "";
});

describe("PageHeader sur mobile", () => {
  it("n'affiche pas le grand en-tête et dépose ses actions dans le tiroir", () => {
    mockViewport(true);
    const container = renderPage();

    expect(container.querySelector(".themed-page-header")).toBeNull();
    expect(container.querySelector("h2")?.className).toContain("sr-only");
    const host = container.querySelector('[data-testid="actions-host"]');
    expect(host?.textContent).toBe("Créer un utilisateur");
  });

  it("garde l'en-tête complet sur grand écran", () => {
    mockViewport(false);
    const container = renderPage();

    expect(container.querySelector(".themed-page-header")).not.toBeNull();
    expect(container.querySelector('[data-testid="actions-host"]')?.textContent).toBe("");
    expect(container.textContent).toContain("Créez des comptes");
  });

  it("garde l'en-tête complet hors de la mise en page de l'application", () => {
    mockViewport(true);
    const container = renderPage(false);

    expect(container.querySelector(".themed-page-header")).not.toBeNull();
  });
});
