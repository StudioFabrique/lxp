import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Welcome from "./Welcome";

describe("accueil de la configuration", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it("ouvre les nouveautés de la version bêta puis permet de les fermer", async () => {
    await act(async () => {
      root.render(
        <MemoryRouter>
          <Welcome onNext={vi.fn()} />
        </MemoryRouter>,
      );
    });

    expect(container.querySelector('a[href="/demo"]')).not.toBeNull();
    expect(document.querySelector("dialog")).toBeNull();

    await act(async () => {
      container
        .querySelector<HTMLButtonElement>('button[aria-label*="version 0.9"]')
        ?.click();
    });

    expect(document.querySelector("dialog h2")?.textContent).toBe("ANDRIA");
    expect(document.querySelector("dialog")?.textContent).toContain("0.9");
    expect(document.querySelector("dialog")?.textContent).toContain("Parcours apprenant");
    expect(
      document.querySelector<HTMLAnchorElement>(
        'dialog a[href="https://github.com/StudioFabrique/lxp"]',
      )?.target,
    ).toBe("_blank");

    await act(async () => {
      Array.from(document.querySelectorAll<HTMLButtonElement>("dialog button"))
        .find((button) => button.textContent?.includes("Fermer"))
        ?.click();
    });

    expect(document.querySelector("dialog")).toBeNull();
  });
});
