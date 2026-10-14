import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import type { ModuleData } from "../../../interfaces/new-module";
import AssignModuleSkillsModal from "./AssignModuleSkillsModal";

const module: ModuleData = {
  id: 1,
  title: "Module principal",
  description: "",
  thumb: null,
  contacts: [],
  skills: [],
};

describe("AssignModuleSkillsModal", () => {
  it("affiche le badge entre la case à cocher et le nom de la compétence", () => {
    const markup = renderToStaticMarkup(
      <AssignModuleSkillsModal
        module={module}
        parcoursSkills={[
          {
            id: 2,
            description: "Structurer ses idées",
            badge: "data:image/png;base64,skill-badge",
          },
        ]}
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    const checkboxPosition = markup.indexOf('type="checkbox"');
    const badgePosition = markup.indexOf("skill-badge");
    const labelPosition = markup.indexOf("Structurer ses idées");

    expect(checkboxPosition).toBeGreaterThan(-1);
    expect(badgePosition).toBeGreaterThan(checkboxPosition);
    expect(labelPosition).toBeGreaterThan(badgePosition);
  });

  it("affiche le trophée de repli lorsqu’une compétence n’a pas de badge", () => {
    const markup = renderToStaticMarkup(
      <AssignModuleSkillsModal
        module={module}
        parcoursSkills={[{ id: 2, description: "Sans badge" }]}
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(markup).toContain('aria-hidden="true"');
    expect(markup).toContain("Sans badge");
  });

  it("propose de créer une compétence, vers l'étape Compétences, quand il n'y en a aucune à associer", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/admin/parcours/edit/12?step=4"]}>
        <AssignModuleSkillsModal
          module={module}
          parcoursSkills={[]}
          isSubmitting={false}
          onClose={vi.fn()}
          onSubmit={vi.fn()}
        />
      </MemoryRouter>,
    );

    expect(markup).toContain("Créer une nouvelle compétence");
    expect(markup).toContain('href="/admin/parcours/edit/12?step=3"');
    expect(markup).not.toContain("déjà associées");
  });
});
