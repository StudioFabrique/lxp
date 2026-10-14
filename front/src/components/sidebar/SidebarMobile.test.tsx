import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, useNavigate } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import SidebarMobile from "./SidebarMobile";

vi.mock("./SidebarWrapper", () => ({
  default: ({
    children,
    variant,
  }: {
    children: React.ReactNode;
    variant: string;
  }) => <nav data-testid="drawer-nav" data-variant={variant}>{children}</nav>,
}));

vi.mock("./SidebarLogo", () => ({ default: () => <svg /> }));

vi.mock("../../store/VisualPreferences", () => ({
  useVisualPreferences: () => ({ animations: false }),
}));

const roots: Root[] = [];
const navigation: { go: (path: string) => void } = { go: () => undefined };

const Navigator = () => {
  navigation.go = useNavigate();
  return null;
};

const renderSidebar = (path = "/admin/user") => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  roots.push(root);
  act(() => {
    root.render(
      <MemoryRouter initialEntries={[path]}>
        <Navigator />
        <SidebarMobile interfaceType="admin">
          <a href="/admin/group">Groupes</a>
        </SidebarMobile>
      </MemoryRouter>,
    );
  });
  return container;
};

const openButton = () =>
  document.querySelector<HTMLButtonElement>(
    'button[aria-label="Ouvrir le menu de navigation"]',
  )!;

// La sortie du tiroir est animée : le retrait du DOM arrive après quelques images.
const settle = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

afterEach(() => {
  roots.splice(0).forEach((root) => act(() => root.unmount()));
  document.body.innerHTML = "";
});

describe("SidebarMobile", () => {
  it("affiche la section courante et garde le menu fermé", () => {
    const container = renderSidebar();

    expect(container.textContent).toContain("Utilisateurs");
    expect(openButton().getAttribute("aria-expanded")).toBe("false");
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  it("ouvre le tiroir avec les entrées de navigation et le met au premier plan du focus", () => {
    renderSidebar();

    act(() => openButton().click());

    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog?.getAttribute("aria-modal")).toBe("true");
    expect(
      dialog?.querySelector('[data-testid="drawer-nav"]')?.getAttribute("data-variant"),
    ).toBe("drawer");
    expect(dialog?.textContent).toContain("Groupes");
    expect(document.activeElement?.getAttribute("aria-label")).toBe("Fermer le menu");
  });

  it("se ferme avec le bouton, Échap ou le fond", async () => {
    renderSidebar();

    act(() => openButton().click());
    act(() =>
      document
        .querySelector<HTMLButtonElement>('button[aria-label="Fermer le menu"]')!
        .click(),
    );
    await settle();
    expect(document.querySelector('[role="dialog"]')).toBeNull();

    act(() => openButton().click());
    act(() => {
      document
        .querySelector('[role="dialog"]')!
        .dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    await settle();
    expect(document.querySelector('[role="dialog"]')).toBeNull();

    act(() => openButton().click());
    act(() =>
      document
        .querySelector<HTMLElement>('[aria-hidden="true"].bg-black\\/50')!
        .click(),
    );
    await settle();
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  it("se ferme quand la page change", async () => {
    renderSidebar();

    act(() => openButton().click());
    act(() => navigation.go("/admin/group"));
    await settle();

    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });
});
