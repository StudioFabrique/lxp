import { afterEach, describe, expect, it } from "vitest";
import { getChatbotTutorials } from "./chatbot-tutorials";
import { resolveTutorialSteps } from "./chatbot-tutorial-steps";

afterEach(() => { document.body.innerHTML = ""; });

describe("tutoriels de l'assistant virtuel", () => {
  it("ne propose rien hors des interfaces connectées", () => {
    expect(getChatbotTutorials("/login")).toEqual([]);
  });

  it("explique la page courante et le menu, boutons du bas compris", () => {
    const tutorials = getChatbotTutorials("/admin/parcours/edit/3");
    expect(tutorials.map((tutorial) => tutorial.id)).toEqual(["page", "menu"]);
    expect(tutorials[0].steps[0].selector).toBe('aside a[href="/admin/parcours"]');
    expect(tutorials[0].steps[0].message).toContain("Parcours");
  });

  it("ne propose pas d'explication de page sur une route sans entrée de menu", () => {
    expect(getChatbotTutorials("/student/profil").map((tutorial) => tutorial.id)).toEqual(["menu"]);
  });

  it("limite le menu étudiant à ses propres entrées", () => {
    const menu = getChatbotTutorials("/student/dashboard").find((tutorial) => tutorial.id === "menu");
    const selectors = menu?.steps.map((step) => step.selector) ?? [];
    expect(selectors).toContain('aside a[href="/student/parcours"]');
    expect(selectors).not.toContain('aside a[href="/admin/user"]');
    expect(selectors).toContain('aside [data-tip="Déconnexion"]');
  });

  it("saute les étapes dont l'élément est absent ou sans taille", () => {
    document.body.innerHTML = '<aside><a href="/admin/parcours">Parcours</a><a href="/admin/user">Utilisateurs</a></aside>';
    const [first, second] = document.querySelectorAll("a");
    first.getBoundingClientRect = () => new DOMRect(0, 0, 100, 30);
    second.getBoundingClientRect = () => new DOMRect(0, 0, 0, 0);
    const tutorial = getChatbotTutorials("/admin/dashboard").find((entry) => entry.id === "menu");
    if (!tutorial) throw new Error("tutoriel du menu introuvable");
    const steps = resolveTutorialSteps(tutorial);
    expect(steps).toHaveLength(1);
    expect(steps[0].element).toBe(first);
    expect(steps[0].message).toContain("Parcours");
  });
});
