import { renderToStaticMarkup } from "react-dom/server";
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
});
