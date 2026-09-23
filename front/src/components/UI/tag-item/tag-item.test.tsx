import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import TagItem from "./tag-item";

const tag = { id: 1, name: "tourisme", color: "rgba(0, 100, 0, 0.5)" };

describe("TagItem", () => {
  it("affiche un tag sans action comme un texte non cliquable", () => {
    const markup = renderToStaticMarkup(<TagItem tag={tag} noIcon compact />);

    expect(markup).toContain("#tourisme");
    expect(markup).not.toContain("<button");
    expect(markup).toContain("color-mix(in srgb");
    expect(markup).toContain("color:#17202a");
  });

  it("conserve un bouton quand une action est fournie", () => {
    const markup = renderToStaticMarkup(<TagItem tag={tag} onClick={() => {}} />);

    expect(markup).toContain('<button type="button"');
  });
});
