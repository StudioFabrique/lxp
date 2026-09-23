import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import {
  levelOptions,
  paceOptions,
} from "./learning-choice-options";
import {
  LevelChoiceButtons,
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

  it("affiche les niveaux comme des boutons radio compacts", () => {
    const markup = renderToStaticMarkup(
      <LevelChoiceButtons name="level-1" value="advanced" onChange={vi.fn()} />,
    );

    expect(markup).toContain('role="radiogroup"');
    expect(markup.match(/type="radio"/g)).toHaveLength(4);
    expect(markup).toContain("Je suis déjà à l&#x27;aise avec le sujet.");
    expect(markup).toContain("focus-within:ring-inset");
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
    expect(markup).toContain("Questions d’entraînement");
    expect(markup).not.toContain("Supports visuels");
  });
});
