import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import ResourcesListCard from "./ResourcesListCard";
import { AbilityContext } from "../../../../rbac/AbilityProvider";
import { createAppAbility } from "../../../../rbac/ability";
import {
  DemoContext,
  DEFAULT_DEMO_CONFIG,
} from "../../../../store/DemoContext";
const resource = {
  id: 7,
  title: "Compléments",
  author: "Auteur",
  createdAt: "2026-09-08",
  imageUrl: "couverture ressource.webp",
  activities: [{ id: 12, type: "text" as const, title: "Lecture", order: 0 }],
};
function render(admin: boolean, permissions: ("update" | "delete")[] = ["update", "delete"]) {
  return renderToStaticMarkup(
    <MemoryRouter>
      <DemoContext
        value={{
          ...DEFAULT_DEMO_CONFIG,
          demoMode: false,
          isConfigLoaded: true,
        }}
      >
        <AbilityContext
          value={createAppAbility(
            permissions.map((action) => ({ action, subject: "resource" })),
          )}
        >
          <ResourcesListCard
            resourcesList={[resource]}
            onDeleteResource={admin ? vi.fn() : undefined}
          />
        </AbilityContext>
      </DemoContext>
    </MemoryRouter>,
  );
}
describe("Cartes des ressources", () => {
  it("utilise la carte hiérarchique et les routes de modification existantes", () => {
    const html = render(true);
    expect(html).toContain('href="/admin/resources/edit/7"');
    expect(html).toContain('href="/admin/resources/edit/7?activityId=12"');
    expect(html).toContain("Lecture");
    expect(html).not.toContain("/resources/add/7");
  });
  it("affiche l'image de la ressource dans le header", () => {
    const html = render(false, []);
    expect(html).toContain(
      "activities/images/couverture%20ressource.webp",
    );
    expect(html).toContain("min-h-24");
  });
  it("renforce le contraste des actions sur l'image du header", () => {
    const html = render(true);
    expect(html).toContain("bg-base-100/90");
    expect(html).toContain("border-white/60");
  });
  it("ne propose pas la suppression sans sa permission", () => {
    expect(render(true, ["update"])).not.toContain("Supprimer la ressource");
  });
  it("oriente les apprenants vers la consultation sans action de modification", () => {
    const html = render(false, []);
    expect(html).toContain(
      'href="/student/ressources/details/7?activityId=12"',
    );
    expect(html).not.toContain("Modifier les détails de la ressource");
    expect(html).not.toContain("Supprimer la ressource");
  });
});
