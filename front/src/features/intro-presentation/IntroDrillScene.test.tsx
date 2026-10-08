import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { buildIntroCards } from "./intro-content";
import IntroDrillScene from "./IntroDrillScene";

vi.mock("./intro-motion", () => ({
  gsap: { to: vi.fn(), fromTo: vi.fn() },
  prefersReducedMotion: () => true,
}));

const onComplete = vi.fn();
const onBackToOverview = vi.fn();
let container: HTMLDivElement;
let root: Root;

const renderScene = (isSaving = false) =>
  act(() =>
    root.render(
      <IntroDrillScene
        cards={buildIntroCards({ organisationName: "Mon école" })}
        isSaving={isSaving}
        onBackToOverview={onBackToOverview}
        onComplete={onComplete}
      />,
    ),
  );

const currentCard = () =>
  container.querySelector<HTMLElement>("article:not([inert])");
const buttonByText = (text: string) =>
  Array.from(container.querySelectorAll("button")).find(
    (button) =>
      button.textContent?.includes(text) ||
      button.getAttribute("aria-label") === text,
  );

/** Clique sur la ligne guidée de la carte courante. */
const descend = () =>
  act(() => currentCard()?.querySelector<HTMLButtonElement>("ul button")?.click());

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  onComplete.mockReset();
  onBackToOverview.mockReset();
  renderScene();
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe("IntroDrillScene", () => {
  it("commence par l'organisme et n'expose que la carte courante", () => {
    expect(currentCard()?.getAttribute("aria-label")).toContain("Organisme de formation : Mon école");
    expect(container.querySelectorAll("article[inert]")).toHaveLength(6);
    expect(container.textContent).toContain("Cliquez sur « Formation 1 (exemple) »");
    expect(currentCard()?.textContent).toContain("3 formations");
    expect(currentCard()?.textContent).toContain("Formation 1");
  });

  it("descend d'un niveau à chaque clic sur la ligne guidée", () => {
    descend();
    expect(currentCard()?.getAttribute("aria-label")).toContain("Formation");

    descend();
    expect(currentCard()?.getAttribute("aria-label")).toContain("Parcours");
  });

  it("n'offre qu'une ligne cliquable par carte", () => {
    expect(currentCard()?.querySelectorAll("ul button")).toHaveLength(1);
    expect(currentCard()?.querySelectorAll("section:not([data-intro-detail]) > ul > li")).toHaveLength(3);
  });

  it("remonte avec le rail", () => {
    descend();
    descend();
    act(() => buttonByText("Formation")?.click());
    expect(currentCard()?.getAttribute("aria-label")).toContain("Formation");

    act(() => buttonByText("Organisme de formation")?.click());
    expect(currentCard()?.getAttribute("aria-label")).toContain("Organisme de formation");
  });

  it("revient à la découverte depuis le premier niveau", () => {
    act(() => buttonByText("Revoir les niveaux")?.click());
    expect(onBackToOverview).toHaveBeenCalledOnce();
  });

  it("ne propose de terminer qu'une fois arrivé aux activités", () => {
    expect(buttonByText("Terminer la présentation")).toBeUndefined();

    for (let level = 0; level < 6; level += 1) descend();

    expect(currentCard()?.getAttribute("aria-label")).toContain("Activités");
    expect(container.textContent).toContain("Vous avez atteint les activités");
    act(() => buttonByText("Terminer la présentation")?.click());
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it("bloque le bouton final pendant l'enregistrement", () => {
    for (let level = 0; level < 6; level += 1) descend();
    renderScene(true);

    expect(buttonByText("Terminer la présentation")?.disabled).toBe(true);
  });

  it("affiche les composants de chaque niveau, en exemples sans contenu réel", () => {
    const labels = () =>
      Array.from(currentCard()?.querySelectorAll("[data-intro-detail]") ?? []).map(
        (section) => section.getAttribute("aria-label"),
      );

    expect(labels()).toEqual(["Groupes", "Tags", "Rôles"]);
    // Les rôles sont réels ; groupes et tags sont des exemples.
    expect(currentCard()?.querySelectorAll("[data-intro-detail] .badge-outline.border-dashed").length).toBeGreaterThan(0);

    descend();
    descend();
    expect(labels()).toEqual(["Groupes", "Tags", "Objectifs", "Compétences", "Contacts"]);
  });
});
