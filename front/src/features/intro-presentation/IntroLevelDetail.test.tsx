import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { buildIntroCards } from "./intro-content";
import IntroLevelDetail from "./IntroLevelDetail";

let container: HTMLDivElement;
let root: Root;

const render = (index: number, activeDetail = -1) =>
  act(() =>
    root.render(
      <IntroLevelDetail
        card={buildIntroCards({ parcoursTitles: ["Mon parcours"], details: { "parcours.tags": ["Web"] } })[index]}
        index={index}
        activeDetail={activeDetail}
      />,
    ),
  );

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe("IntroLevelDetail", () => {
  it("affiche le titre, les éléments enfants puis les composants du niveau", () => {
    render(2);

    expect(container.querySelector("h2")?.textContent).toContain("Mon parcours");
    expect(container.textContent).toContain("3 modules");
    const labels = Array.from(container.querySelectorAll("[data-intro-detail]")).map(
      (section) => section.getAttribute("aria-label"),
    );
    expect(labels).toEqual(["3 modules", "Groupes", "Tags", "Objectifs", "Compétences", "Contacts"]);
    expect(container.textContent).toContain("Web");
  });

  it("met en avant le composant expliqué par le chatbot", () => {
    render(2, 1);

    const active = container.querySelectorAll("[data-intro-detail].ring-2");
    expect(active).toHaveLength(1);
    expect(active[0].getAttribute("aria-label")).toBe("Tags");
  });

  it("n'affiche que les types d'activités au dernier niveau", () => {
    render(6);

    expect(container.textContent).toContain("4 types d'activités");
    expect(container.querySelectorAll("[data-intro-detail]")).toHaveLength(1);
  });
});
