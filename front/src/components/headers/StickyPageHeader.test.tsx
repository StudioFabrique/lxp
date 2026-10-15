import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Header from "./Header";

vi.mock("./SidebarRouteIcon", () => ({ default: () => <svg data-testid="route-icon" /> }));

const roots: Root[] = [];
let observerCallback: IntersectionObserverCallback | null = null;
let observerOptions: IntersectionObserverInit | undefined;

class IntersectionObserverMock {
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    observerCallback = callback;
    observerOptions = options;
  }

  observe = vi.fn();
  disconnect = vi.fn();
}

class ResizeObserverMock {
  observe = vi.fn();
  disconnect = vi.fn();
}

const mockViewport = (isMobile: boolean) => {
  window.matchMedia = ((query: string) => ({
    matches: isMobile && query.includes("max-width"),
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  })) as unknown as typeof window.matchMedia;
};

const renderHeader = () => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  roots.push(root);
  act(() =>
    root.render(
      <MemoryRouter>
        <Header title="Créer un utilisateur" description="Renseignez les informations">
          <button type="button">Sauvegarder</button>
        </Header>
      </MemoryRouter>,
    ),
  );
  return container;
};

const setStuck = (stuck: boolean) =>
  act(() =>
    observerCallback?.(
      [{ intersectionRatio: stuck ? 0.9 : 1 } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    ),
  );

beforeEach(() => {
  observerCallback = null;
  vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
  vi.stubGlobal("ResizeObserver", ResizeObserverMock);
});

afterEach(() => {
  roots.splice(0).forEach((root) => act(() => root.unmount()));
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
});

describe("En-tête de page collant", () => {
  it("affiche le titre, la description et les actions, collé en haut de la zone de défilement", () => {
    mockViewport(false);
    const container = renderHeader();

    expect(container.textContent).toContain("Créer un utilisateur");
    expect(container.textContent).toContain("Renseignez les informations");
    expect(container.textContent).toContain("Sauvegarder");
    expect(container.firstElementChild?.className).toContain("md:sticky");
    // Se détecte lui-même : le haut de la zone observée est rogné de la valeur de `top` .
    expect(observerOptions?.rootMargin).toBe("-24px 0px 0px 0px");
    expect(observerOptions?.threshold).toEqual([1]);
  });

  it("devient une barre flottante une fois collé, en gardant son titre et ses actions", () => {
    mockViewport(false);
    const container = renderHeader();
    const bar = () => container.querySelector<HTMLElement>("[data-floating]")!;

    expect(bar().dataset.floating).toBe("false");
    expect(bar().className).toContain("themed-page-header");

    setStuck(true);

    expect(bar().dataset.floating).toBe("true");
    // L'en-tête garde la largeur de la page : il n'est pas réduit à 60 %.
    expect(bar().className).toContain("w-full");
    expect(bar().className).not.toContain("w-[60vw]");
    expect(bar().className).toContain("backdrop-blur");
    // Collée au bord de l'écran : seuls les coins du bas sont arrondis.
    expect(bar().className).toContain("rounded-t-none");
    expect(bar().className).toContain("rounded-b-2xl");
    expect(container.firstElementChild?.className).toContain("md:top-0");
    expect(bar().className).not.toContain("themed-page-header");
    expect(container.querySelector("h2")?.textContent).toBe("Créer un utilisateur");
    expect(container.textContent).toContain("Sauvegarder");
    // La description reste affichée.
    expect(container.querySelector("p")?.textContent).toBe("Renseignez les informations");
  });

  it("retrouve l'en-tête habituel quand il redescend", () => {
    mockViewport(false);
    const container = renderHeader();

    setStuck(true);
    setStuck(false);

    const bar = container.querySelector<HTMLElement>("[data-floating]")!;
    expect(bar.dataset.floating).toBe("false");
    expect(bar.className).toContain("w-full");
    expect(container.querySelector("p")?.textContent).toBe("Renseignez les informations");
  });

  it("ne colle pas l'en-tête sur mobile, sans observer le défilement", () => {
    mockViewport(true);
    const container = renderHeader();

    expect(container.querySelector("h2")?.textContent).toBe("Créer un utilisateur");
    expect(observerCallback).toBeNull();
    expect((container.firstElementChild as HTMLElement).style.height).toBe("");
  });

  it("rend collant un sous-en-tête, mais pas un en-tête désactivé", () => {
    mockViewport(false);
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    roots.push(root);
    act(() =>
      root.render(
        <MemoryRouter>
          <Header title="Première étape" isSubHeader />
          <Header title="Seconde étape" isSubHeader disabled />
        </MemoryRouter>,
      ),
    );

    expect(container.querySelectorAll('[data-testid="sticky-page-header"]')).toHaveLength(1);
    expect(container.textContent).toContain("Seconde étape");
  });

  it("reste fixe dans la page quand `sticky` est désactivé", () => {
    mockViewport(false);
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    roots.push(root);
    act(() =>
      root.render(
        <MemoryRouter>
          <Header title="Contenu du module" sticky={false}>
            <button type="button">Modifier le module</button>
          </Header>
        </MemoryRouter>,
      ),
    );

    expect(container.querySelector('[data-testid="sticky-page-header"]')).toBeNull();
    expect(container.textContent).toContain("Modifier le module");
    expect(observerCallback).toBeNull();
  });
});
