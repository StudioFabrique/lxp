import type { ReactNode } from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import AdminOnboarding from "./admin-onboarding";

vi.mock("../../../../components/guards/PermissionGuard", () => ({
  default: ({ children }: { children: ReactNode }) => children,
}));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const roots: Root[] = [];

const render = (props: Partial<Parameters<typeof AdminOnboarding>[0]> = {}) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  roots.push(root);
  act(() =>
    root.render(
      <MemoryRouter>
        <AdminOnboarding
          isTeacher={false}
          formations={[]}
          modulesCount={0}
          teachersCount={0}
          studentsCount={0}
          groupsCount={0}
          onCreateFormation={vi.fn()}
          onCreateParcours={vi.fn()}
          {...props}
        />
      </MemoryRouter>,
    ),
  );
  return container;
};

const toggle = (container: HTMLElement) =>
  container.querySelector<HTMLButtonElement>("button[aria-expanded]");

afterEach(() => {
  roots.splice(0).forEach((root) => act(() => root.unmount()));
  document.body.innerHTML = "";
});

describe("AdminOnboarding", () => {
  it("est repliée sur l'étape à faire, avec la progression", () => {
    const container = render();

    expect(container.textContent).toContain("0 étape sur 5");
    expect(container.querySelectorAll("li")).toHaveLength(1);
    expect(container.textContent).toContain("Inviter un membre de l'équipe pédagogique");
    expect(container.querySelectorAll('[aria-current="step"]')).toHaveLength(1);
    expect(toggle(container)?.getAttribute("aria-label")).toBe("Afficher les 4 étapes suivantes");
  });

  it("se replie sur la formation quand l'équipe pédagogique est déjà invitée", () => {
    const container = render({ isTeacher: true });

    expect(container.textContent).toContain("1 étape sur 5");
    expect(container.querySelector('[data-chatbot-target="onboarding-current-step"]')?.textContent).toBe(
      "Créer ma première formation",
    );
  });

  it("déplie les étapes suivantes, verrouillées tant que leurs prérequis manquent", () => {
    const container = render();

    act(() => toggle(container)?.click());

    expect(container.querySelectorAll("li")).toHaveLength(5);
    expect(container.textContent).toContain("Créez d'abord une formation.");
    expect(toggle(container)?.getAttribute("aria-expanded")).toBe("true");
    expect(toggle(container)?.textContent).toBe("Réduire");
  });

  it("n'offre pas de dépliage quand il ne reste qu'une étape", () => {
    const container = render({
      isTeacher: true,
      studentsCount: 2,
      modulesCount: 1,
      formations: [
        {
          id: 1,
          title: "Formation",
          level: "1",
          parcours: [
            { id: 1, title: "P", startDate: null, endDate: null, isPublished: false, thumb: null },
          ],
        },
      ],
    });

    expect(toggle(container)).toBeNull();
  });

  it("compte seulement les étapes obligatoires et signale l'étape administrateur comme optionnelle", () => {
    const container = render({ canAddAdmin: true, adminsCount: 0 });

    expect(container.textContent).toContain("0 étape sur 5");
    expect(toggle(container)?.getAttribute("aria-label")).toBe("Afficher les 5 étapes suivantes");

    act(() => toggle(container)?.click());

    expect(container.querySelectorAll("li")).toHaveLength(6);
    expect(container.textContent).toContain("Ajouter un administrateur supplémentaire");
    expect(container.textContent).toContain("Optionnelle");
  });

  it("permet de passer l'étape optionnelle et s'en souvient", () => {
    window.localStorage.clear();
    const container = render({ canAddAdmin: true, adminsCount: 0 });
    act(() => toggle(container)?.click());

    const skipButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label^="Passer l\'étape"]',
    );
    expect(skipButton).not.toBeNull();

    act(() => skipButton?.click());

    expect(container.textContent).not.toContain("Ajouter un administrateur supplémentaire");
    expect(container.querySelectorAll("li")).toHaveLength(5);
  });
});
