import { afterEach, describe, expect, it } from "vitest";
import { chatbotGuide, getChatbotTutorials } from "./chatbot-tutorials";
import { resolveTutorialSteps } from "./chatbot-tutorial-steps";
import { sidebarItems } from "../../config/sidebarItems";

afterEach(() => { document.body.innerHTML = ""; });

const menuOf = (pathname: string, layout: "admin" | "student") => {
  const menu = getChatbotTutorials(pathname).find((entry) => entry.id === `${layout}:menu`);
  if (!menu) throw new Error("tutoriel du menu introuvable");
  return menu;
};

describe("guide de l'assistant virtuel", () => {
  it("ne propose rien hors des interfaces connectées", () => {
    expect(getChatbotTutorials("/login")).toEqual([]);
  });

  it("propose d'abord l'explication de la page, puis le menu, puis les autres questions de la page", () => {
    const ids = getChatbotTutorials("/admin/user").map((tutorial) => tutorial.id);
    expect(ids.slice(0, 3)).toEqual(["admin-user-list:what", "admin:menu", "admin-user-list:create"]);
  });

  it("applique une même page à ses routes avec paramètre", () => {
    const labels = getChatbotTutorials("/admin/user/edit/12").map((tutorial) => tutorial.label);
    expect(labels).toContain("Comment changer le rôle ?");
  });

  it("ne garde que le menu sur une page absente du guide", () => {
    expect(getChatbotTutorials("/student/inconnu").map((tutorial) => tutorial.id)).toEqual(["student:menu"]);
  });

  it("limite le menu étudiant à ses propres entrées", () => {
    const selectors = menuOf("/student/dashboard", "student").steps.map((step) => step.selector);
    expect(selectors).toContain('aside a[href="/student/parcours"]');
    expect(selectors).not.toContain('aside a[href="/admin/user"]');
    expect(selectors).toContain('aside [data-tip="Déconnexion"]');
  });

  it("couvre chaque entrée du menu latéral", () => {
    (["admin", "student"] as const).forEach((layout) => {
      const selectors = menuOf(`/${layout}/dashboard`, layout).steps.map((step) => step.selector);
      sidebarItems[layout].forEach((item) => expect(selectors).toContain(`aside a[href="/${layout}/${item.path}"]`));
    });
  });

  it("n'utilise que des sélecteurs CSS valides et des identifiants uniques", () => {
    const pageIds = chatbotGuide.pages.map((page) => page.id);
    expect(new Set(pageIds).size).toBe(pageIds.length);
    chatbotGuide.pages.forEach((page) => {
      expect(new Set(page.questions.map((question) => question.id)).size).toBe(page.questions.length);
      page.routes.forEach((route) => getChatbotTutorials(route.replace(/:\w+/g, "1")).forEach((tutorial) => {
        tutorial.steps.forEach((step) => expect(() => document.querySelector(step.selector)).not.toThrow());
      }));
    });
  });

  it("ne désigne que des repères `data-chatbot-target` présents dans le code", () => {
    const sources = Object.values(import.meta.glob("../../**/*.tsx", { query: "?raw", import: "default", eager: true })).join("\n");
    const targets = new Set(
      [...chatbotGuide.layouts.admin.questions, ...chatbotGuide.layouts.student.questions, ...chatbotGuide.pages.flatMap((page) => page.questions)]
        .flatMap((question) => question.steps ?? [])
        .flatMap((step) => (step.target ? [step.target] : [])),
    );
    expect(targets.size).toBeGreaterThan(0);
    targets.forEach((target) => expect(sources, `repère introuvable : ${target}`).toContain(`data-chatbot-target="${target}"`));
  });

  it("saute les étapes dont l'élément est absent ou sans taille", () => {
    document.body.innerHTML = '<aside><a href="/admin/parcours">Parcours</a><a href="/admin/user">Utilisateurs</a></aside>';
    const [first, second] = document.querySelectorAll("a");
    first.getBoundingClientRect = () => new DOMRect(0, 0, 100, 30);
    second.getBoundingClientRect = () => new DOMRect(0, 0, 0, 0);
    const steps = resolveTutorialSteps(menuOf("/admin/dashboard", "admin"));
    expect(steps).toHaveLength(1);
    expect(steps[0].element).toBe(first);
    expect(steps[0].message).toContain("Parcours");
  });
});
