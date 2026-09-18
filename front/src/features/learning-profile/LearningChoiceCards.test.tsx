import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import {
  levelOptions,
  paceOptions,
  PreferenceCards,
  SingleChoiceCards,
} from "./LearningChoiceCards";

describe("LearningChoiceCards", () => {
  it("expose les rythmes comme un groupe de boutons radio", () => {
    const markup = renderToStaticMarkup(
      <SingleChoiceCards
        name="pace"
        options={paceOptions}
        value="standard"
        onChange={vi.fn()}
      />,
    );

    expect(markup).toContain('role="radiogroup"');
    expect(markup).toContain('checked=""');
    expect(markup).toContain("Standard");
    expect(markup).toContain("Sans préférence");
  });

  it("propose exactement les quatre niveaux déclaratifs prévus", () => {
    expect(levelOptions.map(({ value }) => value)).toEqual([
      "beginner",
      "intermediate",
      "advanced",
      "unsure",
    ]);
  });

  it("expose les préférences comme des cases à cocher accessibles", () => {
    const markup = renderToStaticMarkup(
      <PreferenceCards
        value={["concrete_examples"]}
        onChange={vi.fn()}
      />,
    );

    expect(markup).toContain('role="group"');
    expect(markup).toContain('type="checkbox"');
    expect(markup).toContain("Exemples concrets");
    expect(markup).toContain("Supports visuels");
  });
});
