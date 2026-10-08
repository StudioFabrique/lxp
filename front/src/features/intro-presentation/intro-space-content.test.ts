import { describe, expect, it } from "vitest";

import type { SidebarItemConfig } from "../../config/sidebarItems";
import { INTRO_ROLES } from "./intro-role";
import {
  buildInitials,
  buildNavEntries,
  buildStudentContent,
  buildTeamContent,
  capitalizeWords,
} from "./intro-space-content";

const item = (key: string, label: string, teacherOnly = false) =>
  ({ key, label, teacherOnly, subject: "user", path: key }) as SidebarItemConfig;

describe("intro-space-content", () => {
  it("met les mots en capitale et calcule les initiales", () => {
    expect(capitalizeWords("bonjour élodie !")).toBe("Bonjour Élodie !");
    expect(buildInitials({ firstname: "martin", lastname: "Dhollande" })).toBe("MD");
    expect(buildInitials({})).toBe("");
  });

  it("ne garde que les entrées lisibles, et les évaluations pour l'équipe pédagogique", () => {
    const items = [item("a", "Accueil"), item("b", "Rôles"), item("c", "Évaluations", true)];
    const canRead = (entry: SidebarItemConfig) => entry.key !== "b";

    expect(buildNavEntries(items, { canRead, isTeacher: false }).map((e) => e.label)).toEqual(["Accueil"]);
    expect(buildNavEntries(items, { canRead, isTeacher: true }).map((e) => e.label)).toEqual(["Accueil", "Évaluations"]);
  });

  it("construit le dashboard administrateur sans bouton d'en-tête ni retours", () => {
    const content = buildTeamContent({
      role: INTRO_ROLES[1],
      person: { firstname: "Ada", lastname: "Lovelace" },
      isTeacher: false,
      title: "Bonjour ada !",
      message: "Bienvenue",
      nav: [],
      recommended: [],
      modules: [],
      modulesTitle: "Derniers modules créés",
      parcours: [{ id: 1, title: "F", level: "", parcours: [{ id: 2, title: "P1", startDate: null, endDate: null, isPublished: true, thumb: null }] }],
      feedbacks: [],
      canCreateFormation: true,
      canCreateParcours: false,
    });

    expect(content.headerAction).toBeNull();
    expect(content.title).toBe("Bonjour Ada !");
    expect(content.cards.map((card) => card.id)).toEqual(["dash-actions", "dash-alerts", "dash-latest", "dash-feedback"]);
    expect(content.cards[2].rows).toEqual([{ title: "P1", subtitle: "F" }]);
    expect(content.cards[3].title).toBe("Actions rapides");
    expect(content.cards[0].rows).toHaveLength(1);
  });

  it("limite les lignes à deux et propose une action quand l'apprenant n'a rien lu", () => {
    const content = buildStudentContent({
      role: INTRO_ROLES[3],
      person: { firstname: "Léa" },
      title: "Bonjour Léa",
      message: "",
      nav: [],
      parcours: [{ title: "A" }, { title: "B" }, { title: "C" }],
    });

    expect(content.cards[0].rows).toHaveLength(2);
    expect(content.resume?.action).toBe("Découvrir mes parcours");
  });
});
