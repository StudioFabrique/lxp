import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import toast from "react-hot-toast";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import AppToaster from "./AppToaster";

let root: Root | null = null;

beforeEach(() => {
  vi.stubGlobal("matchMedia", () => ({ matches: false }));
});

afterEach(() => {
  act(() => {
    toast.remove();
    root?.unmount();
  });
  root = null;
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
});

const renderToaster = (pathname: string) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  const router = {
    state: { location: { pathname } },
    subscribe: () => () => undefined,
  } as unknown as Parameters<typeof AppToaster>[0]["router"];

  act(() => root?.render(<AppToaster router={router} />));
  act(() => {
    toast.error("Le parcours doit avoir au moins un contact");
  });

  return container.firstElementChild as HTMLElement;
};

describe("AppToaster", () => {
  it("garde la marge standard par défaut", () => {
    const toasterContainer = renderToaster("/formations");

    expect(toasterContainer.style.bottom).toBe("16px");
  });

  it("les affiche au-dessus de la barre d'actions sur l'édition d'un parcours", () => {
    const toasterContainer = renderToaster("/parcours/edit/12");

    expect(toasterContainer.style.bottom).toBe("6.5rem");
  });

  it("limite l'affichage à deux toasts en même temps", () => {
    vi.useFakeTimers();
    try {
      const container = document.createElement("div");
      document.body.appendChild(container);
      root = createRoot(container);
      const router = {
        state: { location: { pathname: "/formations" } },
        subscribe: () => () => undefined,
      } as unknown as Parameters<typeof AppToaster>[0]["router"];
      act(() => root?.render(<AppToaster router={router} />));

      act(() => {
        toast.success("Premier");
        toast.success("Deuxième");
        toast.success("Troisième");
      });
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(container.textContent).not.toContain("Premier");
      expect(container.textContent).toContain("Deuxième");
      expect(container.textContent).toContain("Troisième");
    } finally {
      vi.useRealTimers();
    }
  });
});
