import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import QuickActions from "./quick-actions";
import { MobileHeaderActionsProvider } from "../../../store/MobileHeaderActionsProvider";
import { useMobileHeaderActions } from "../../../hooks/useMobileHeaderActions";

vi.mock("../../../components/guards/PermissionGuard", () => ({
  default: ({ children }: { children: ReactNode }) => children,
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

const ActionsHost = () => {
  const actions = useMobileHeaderActions();
  return <div data-testid="actions-host" ref={actions?.setContainer} />;
};

const renderQuickActions = () => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  roots.push(root);
  act(() =>
    root.render(
      <MemoryRouter>
        <MobileHeaderActionsProvider>
          <ActionsHost />
          <section data-testid="page">
            <QuickActions onCreateFormation={vi.fn()} onCreateParcours={vi.fn()} />
          </section>
        </MobileHeaderActionsProvider>
      </MemoryRouter>,
    ),
  );
};

afterEach(() => {
  roots.splice(0).forEach((root) => act(() => root.unmount()));
  document.body.innerHTML = "";
});

describe("QuickActions", () => {
  it("dépose ses entrées dans le tiroir de la barre mobile, même hors de l'en-tête de page", () => {
    mockViewport(true);
    renderQuickActions();

    const host = document.querySelector('[data-testid="actions-host"]')!;
    expect(host.textContent).toContain("Créer une formation");
    expect(host.textContent).toContain("Créer un parcours");
    expect(document.querySelector('[data-testid="page"]')!.textContent).toBe("");
  });

  it("garde le menu déroulant hors mobile", () => {
    mockViewport(false);
    renderQuickActions();

    const page = document.querySelector('[data-testid="page"]')!;
    expect(page.textContent).toContain("Actions rapides");
    expect(document.querySelector('[data-testid="actions-host"]')!.textContent).toBe("");
  });
});
