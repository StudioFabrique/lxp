import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type Module from "../../../../utils/interfaces/module";
import ProgressModulesStats from "./progress-stats";

const createModule = (id: number, progress: number) =>
  ({
    id,
    title: `Module ${id}`,
    stats: { progress },
  }) as Module;

describe("Votre avancement dans le parcours", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
  });

  const renderComponent = async (modules: Module[]) => {
    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={["/student/parcours/view/42"]}>
          <ProgressModulesStats modules={modules} />
        </MemoryRouter>,
      );
    });
  };

  it("complète moins de quatre modules en cours avec les modules non commencés et terminés", async () => {
    await renderComponent([
      createModule(1, 25),
      createModule(2, 75),
      createModule(3, 0),
      createModule(4, 100),
      createModule(5, 0),
    ]);

    const links = container.querySelectorAll("a");
    expect(links).toHaveLength(4);
    expect(links[0].textContent).toContain("Module 2");
    expect(links[1].textContent).toContain("Module 1");
    expect(links[2].textContent).toContain("Module 3");
    expect(links[3].textContent).toContain("Module 5");
    expect(container.textContent).not.toContain("Module 4");

    const showMore = container.querySelector<HTMLButtonElement>(
      'button[aria-expanded="false"]',
    );
    expect(showMore?.textContent).toContain("Afficher plus (1)");

    await act(async () => showMore?.click());

    expect(container.querySelectorAll("a")).toHaveLength(5);
    expect(container.textContent).toContain("Module 4");
    expect(container.textContent).toContain("Afficher moins");
  });

  it("reste replié à quatre modules puis en affiche au maximum douze", async () => {
    await renderComponent(
      Array.from({ length: 15 }, (_, index) =>
        createModule(index + 1, 99 - index),
      ),
    );

    expect(container.querySelectorAll("a")).toHaveLength(4);

    const showMore = container.querySelector<HTMLButtonElement>(
      'button[aria-expanded="false"]',
    );
    expect(showMore?.textContent).toContain("Afficher plus (8)");

    await act(async () => showMore?.click());

    expect(container.querySelectorAll("a")).toHaveLength(12);
    expect(showMore?.getAttribute("aria-expanded")).toBe("true");
  });

  it("n'ajoute pas les modules terminés quand au moins quatre sont en cours", async () => {
    await renderComponent([
      createModule(1, 80),
      createModule(2, 60),
      createModule(3, 40),
      createModule(4, 20),
      createModule(5, 100),
      createModule(6, 0),
    ]);

    expect(container.querySelectorAll("a")).toHaveLength(4);
    expect(container.textContent).not.toContain("Module 5");
    expect(container.textContent).not.toContain("Module 6");
    expect(container.querySelector("button")).toBeNull();
  });
});
