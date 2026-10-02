import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { createMemoryRouter, Link, RouterProvider, useNavigate } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import NavigationFeedback from "./NavigationFeedback";
import { VisualPreferencesProvider } from "../../store/VisualPreferences";

function deferred() {
  let resolve!: (value: null) => void;
  const promise = new Promise<null>((done) => { resolve = done; });
  return { promise, resolve };
}

function SourcePage() {
  const navigate = useNavigate();
  return (
    <>
      <Link id="link" to="/next" aria-busy="false" onClick={(event) => event.stopPropagation()}>
        <span>Ouvrir le cours</span>
      </Link>
      <button id="button" onClick={() => navigate("/next")}>Continuer</button>
      <div id="card" className="cursor-pointer" onClick={() => navigate("/next")}><span>Carte</span></div>
      <div id="double" className="cursor-pointer" onDoubleClick={() => navigate("/next")}>Module</div>
      <button id="local">Afficher plus</button>
      <Link id="tab" to="/next" target="_blank">Nouvel onglet</Link>
      <Link id="other" to="/other">Autre page</Link>
    </>
  );
}

describe("navigation feedback", () => {
  let container: HTMLDivElement;
  let root: Root;
  let router: ReturnType<typeof createMemoryRouter>;
  let next: ReturnType<typeof deferred>;
  let other: ReturnType<typeof deferred>;
  let loader: ReturnType<typeof vi.fn<() => Promise<null>>>;

  beforeEach(async () => {
    vi.useFakeTimers();
    localStorage.removeItem("visualPreferences");
    next = deferred();
    other = deferred();
    loader = vi.fn(() => next.promise);
    router = createMemoryRouter([
      { path: "/", element: <SourcePage /> },
      { path: "/next", loader, element: <h1>Cours</h1>, errorElement: <h1>Erreur</h1> },
      { path: "/other", loader: () => other.promise, element: <h1>Autre</h1> },
    ]);
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    await act(async () => root.render(<><NavigationFeedback router={router} /><RouterProvider router={router} /></>));
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    router.dispose();
    container.remove();
    vi.useRealTimers();
    localStorage.removeItem("visualPreferences");
  });

  it.each(["link", "button", "card", "double"])("marks the %s immediately until the route is ready", async (id) => {
    const source = container.querySelector<HTMLElement>(`#${id}`)!;
    const child = source.querySelector("span") ?? source;
    await act(async () => {
      child.dispatchEvent(new MouseEvent(id === "double" ? "dblclick" : "click", { bubbles: true, cancelable: true }));
    });
    expect(source.getAttribute("aria-busy")).toBe("true");
    expect(source.hasAttribute("data-navigation-pending")).toBe(true);
    expect(container.querySelector('[data-phase="loading"]')).not.toBeNull();
    expect(container.querySelector("#local")).not.toBeNull();
    expect(container.querySelector('[role="status"]')?.textContent).toBe("");

    await act(async () => vi.advanceTimersByTime(800));
    expect(container.querySelector('[role="status"]')?.textContent).toBe("Chargement de la page…");
    await act(async () => next.resolve(null));
    expect(container.querySelector("h1")?.textContent).toBe("Cours");
    expect(source.hasAttribute("data-navigation-pending")).toBe(false);
    expect(source.getAttribute("aria-busy")).toBe(id === "link" ? "false" : null);
    expect(container.querySelector('[data-phase="complete"]')).not.toBeNull();
    expect(container.querySelector('[role="status"]')?.textContent).toBe("");
    await act(async () => vi.advanceTimersByTime(180));
    expect(container.querySelector('[data-phase="idle"]')).not.toBeNull();
  });

  it("blocks repeated activation but allows navigation to a different destination", async () => {
    const source = container.querySelector<HTMLAnchorElement>("#link")!;
    await act(async () => source.click());
    await act(async () => source.click());
    expect(loader).toHaveBeenCalledTimes(1);
    const replacement = container.querySelector<HTMLAnchorElement>("#other")!;
    await act(async () => replacement.click());
    expect(source.getAttribute("aria-busy")).toBe("false");
    expect(replacement.getAttribute("aria-busy")).toBe("true");
    await act(async () => other.resolve(null));
    expect(container.querySelector("h1")?.textContent).toBe("Autre");
    expect(replacement.hasAttribute("aria-busy")).toBe(false);
  });

  it("does not animate local actions, modified clicks or links to another tab", async () => {
    await act(async () => {
      container.querySelector<HTMLButtonElement>("#local")!.click();
      container.querySelector("#link")!.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, ctrlKey: true }));
      container.querySelector<HTMLAnchorElement>("#tab")!.click();
    });
    expect(container.querySelector("[data-navigation-pending]")).toBeNull();
    expect(container.querySelector('[data-phase="idle"]')).not.toBeNull();
    expect(loader).not.toHaveBeenCalled();
  });

  it("shows global feedback for programmatic navigation without marking a stale clicked button", async () => {
    await act(async () => container.querySelector<HTMLButtonElement>("#local")!.click());
    await act(async () => { void router.navigate("/next"); });
    expect(container.querySelector('[data-phase="loading"]')).not.toBeNull();
    expect(container.querySelector("[data-navigation-pending]")).toBeNull();
    await act(async () => next.resolve(null));
  });

  it("clears loading when the destination fails", async () => {
    router.dispose();
    router = createMemoryRouter([
      { path: "/", element: <SourcePage /> },
      { path: "/next", loader: async () => { await next.promise; throw new Error("Offline"); }, errorElement: <h1>Erreur</h1> },
    ]);
    await act(async () => root.render(<><NavigationFeedback router={router} /><RouterProvider router={router} /></>));
    const source = container.querySelector<HTMLAnchorElement>("#link")!;
    await act(async () => source.click());
    await act(async () => next.resolve(null));
    expect(container.querySelector("h1")?.textContent).toBe("Erreur");
    expect(source.getAttribute("aria-busy")).toBe("false");
    expect(container.querySelector('[data-phase="loading"]')).toBeNull();
  });

  it("covers the first download of a lazy page", async () => {
    router.dispose();
    router = createMemoryRouter([
      { path: "/", element: <SourcePage /> },
      { path: "/next", lazy: async () => { await next.promise; return { Component: () => <h1>Première ouverture</h1> }; } },
    ]);
    await act(async () => root.render(<><NavigationFeedback router={router} /><RouterProvider router={router} /></>));
    const source = container.querySelector<HTMLAnchorElement>("#link")!;
    await act(async () => source.click());
    expect(source.getAttribute("aria-busy")).toBe("true");
    await act(async () => next.resolve(null));
    expect(container.querySelector("h1")?.textContent).toBe("Première ouverture");
    expect(source.getAttribute("aria-busy")).toBe("false");
  });

  it("cancels feedback on history navigation and cleans up on unmount", async () => {
    const source = container.querySelector<HTMLAnchorElement>("#link")!;
    await act(async () => source.click());
    await act(async () => { void router.navigate(-1); });
    expect(source.getAttribute("aria-busy")).toBe("false");
    expect(container.querySelector('[data-phase="loading"]')).toBeNull();
    await act(async () => source.click());
    expect(source.getAttribute("aria-busy")).toBe("true");
    await act(async () => root.render(<RouterProvider router={router} />));
    expect(source.hasAttribute("data-navigation-pending")).toBe(false);
    expect(source.getAttribute("aria-busy")).toBe("false");
  });

  it("respects disabled animations while retaining visible loading feedback", async () => {
    localStorage.setItem("visualPreferences", JSON.stringify({ animations: false }));
    await act(async () => root.render(
      <VisualPreferencesProvider><NavigationFeedback router={router} /><RouterProvider router={router} /></VisualPreferencesProvider>,
    ));
    const source = container.querySelector<HTMLAnchorElement>("#link")!;
    await act(async () => source.click());
    expect(source.getAttribute("data-navigation-static")).toBe("true");
    expect(container.querySelector('[data-phase="loading"]')?.getAttribute("data-animated")).toBe("false");
    await act(async () => next.resolve(null));
    expect(source.hasAttribute("data-navigation-static")).toBe(false);
  });
});
