import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import IntroMobileSpace from "./IntroMobileSpace";
const preferences = vi.hoisted(() => ({ animations: false }));
vi.mock("../../store/VisualPreferences", () => ({
  useVisualPreferences: () => ({ glow: true, confetti: true, animations: preferences.animations }),
}));
vi.mock("../../hooks/useInstanceBranding", () => ({
  useInstanceBranding: () => ({ logoUrl: null, websiteUrl: null }),
}));
import type { IntroSpaceContent } from "./intro-space-content";

const content: IntroSpaceContent = {
  space: "team",
  spaceLabel: "Espace équipe",
  userName: "Martin D",
  initials: "MD",
  roleLabel: "Administrateur",
  title: "Bonjour Martin !",
  message: "",
  headerAction: "Créer ma première formation",
  nav: [
    { key: "home", label: "Accueil", displayLabel: "Accueil", description: "Votre tableau de bord." },
    { key: "user", label: "Utilisateurs", displayLabel: "Utilisateurs", description: "Gérez les comptes." },
    { key: "tag", label: "Tags", displayLabel: "Tags", description: "" },
  ],
  cards: [],
};

let container: HTMLDivElement;
let root: Root;

const button = (label: string): HTMLButtonElement => {
  const found = Array.from(container.querySelectorAll("button")).find((entry) => entry.textContent?.trim() === label);
  if (!found) throw new Error(`Bouton introuvable : ${label}`);
  return found;
};
const click = (label: string) => act(() => button(label).click());
const explanation = () => container.querySelector("section[aria-label='Explication'] p")?.textContent;

beforeEach(() => {
  preferences.animations = false;
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe("IntroMobileSpace", () => {
  it("reproduit la barre mobile et explique chaque élément avec Précédent / Suivant", () => {
    act(() => root.render(<IntroMobileSpace content={content} onEnded={vi.fn()} />));
    expect(container.textContent).toContain("Bonjour Martin !");
    expect(explanation()).toContain("barre de navigation");
    expect(container.textContent).not.toContain("Précédent");
    // La carte indique la progression et l'intitulé de l'étape, comme le tutoriel du bureau.
    expect(container.textContent).toContain("Étape 1 sur 8");
    expect(container.querySelector("section[aria-label='Explication'] h2")?.textContent).toBe("Barre de navigation");

    click("Suivant");
    expect(explanation()).toContain("ouvre le menu");
    // Le tiroir reproduit le menu : toutes les sections, puis les blocs du bas du vrai menu.
    expect(container.textContent).toContain("Utilisateurs");
    expect(container.textContent).toContain("Martin D");
    expect(container.textContent).toContain("Consommation IA");
    expect(container.textContent).toContain("Revoir la présentation");
    expect(container.textContent).toContain("Déconnexion");
    expect(container.querySelector("[data-explained]")).toBeNull();

    click("Suivant");
    expect(explanation()).toBe("Votre tableau de bord.");
    click("Suivant");
    expect(explanation()).toBe("Gérez les comptes.");
    expect(container.querySelector("[data-explained]")?.textContent).toBe("Utilisateurs");
    // Une section sans explication n'a pas d'étape.
    click("Suivant");
    expect(explanation()).toContain("titre de la barre");

    click("Précédent");
    expect(explanation()).toBe("Gérez les comptes.");
  });

  it("joue l'ouverture 3D, sauf quand les animations sont désactivées", () => {
    act(() => root.render(<IntroMobileSpace content={content} onEnded={vi.fn()} />));
    expect(container.querySelector("[data-intro-opening]")).toBeNull();
    act(() => root.unmount());

    preferences.animations = true;
    root = createRoot(container);
    act(() => root.render(<IntroMobileSpace content={content} onEnded={vi.fn()} />));
    expect(container.querySelector("[data-intro-opening]")).not.toBeNull();
    // L'ouverture est décorative : le tutoriel reste utilisable pendant qu'elle joue.
    click("Suivant");
    expect(explanation()).toContain("ouvre le menu");
  });

  it("ne rend la main qu'au clic sur Terminer, au dernier message", () => {
    const onEnded = vi.fn();
    act(() => root.render(<IntroMobileSpace content={content} onEnded={onEnded} />));
    while (!Array.from(container.querySelectorAll("button")).some((entry) => entry.textContent?.trim() === "Terminer")) {
      click("Suivant");
    }
    expect(explanation()).toContain("en bas à droite");
    expect(onEnded).not.toHaveBeenCalled();
    click("Terminer");
    expect(onEnded).toHaveBeenCalledTimes(1);
  });
});
