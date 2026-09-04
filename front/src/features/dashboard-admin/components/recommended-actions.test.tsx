import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import RecommendedActions from "./recommended-actions";
import {
  recommendedActionIcons,
  type RecommendedAction,
} from "./recommended-action-config";

const actions: RecommendedAction[] = [
  {
    id: "teachers",
    title: "Inviter l'équipe pédagogique",
    description: "Créer un formateur",
    to: "/teachers",
    icon: recommendedActionIcons.inviteTeachers,
  },
  {
    id: "admin",
    title: "Créer un administrateur",
    description: "Créer un administrateur hors root",
    to: "/admin",
    icon: recommendedActionIcons.createAdmin,
  },
  {
    id: "logo",
    title: "Changer le logo de l'organisme",
    description: "Personnaliser la plateforme",
    to: "/logo",
    icon: recommendedActionIcons.changeLogo,
  },
];

describe("RecommendedActions", () => {
  let root: Root | null = null;

  beforeEach(() => localStorage.clear());

  afterEach(() => {
    if (root) act(() => root?.unmount());
    root = null;
    localStorage.clear();
  });

  it("conserve l'ordre fourni pour les actions visibles", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <RecommendedActions userId="root-id" actions={actions} />
      </MemoryRouter>,
    );

    expect(markup.indexOf(`href="${actions[0].to}"`)).toBeLessThan(
      markup.indexOf(`href="${actions[1].to}"`),
    );
    expect(markup.indexOf(`href="${actions[1].to}"`)).toBeLessThan(
      markup.indexOf(`href="${actions[2].to}"`),
    );
  });

  it("masque durablement le bloc pour l'utilisateur courant", () => {
    const container = document.createElement("div");
    root = createRoot(container);

    act(() => {
      root?.render(
        <MemoryRouter>
          <RecommendedActions userId="teacher-id" actions={actions} />
        </MemoryRouter>,
      );
    });

    const skipButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Masquer les actions recommandées"]',
    );
    act(() => skipButton?.click());

    expect(container.textContent).toBe("");
    expect(
      localStorage.getItem("lxp:recommended-actions:hidden:teacher-id"),
    ).toBe("true");
  });
});
