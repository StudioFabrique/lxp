import { describe, expect, it } from "vitest";
import { formatQuizExplanation } from "./format-quiz-explanation";

describe("mise en forme des explications de quiz", () => {
  it("sépare une introduction, des puces et la conclusion", () => {
    expect(formatQuizExplanation("À vérifier : • Accueil : recevoir le client. • Conseil : l'orienter. Retiens : chaque rôle compte.")).toBe(
      "À vérifier :\n\n- Accueil : recevoir le client.\n- Conseil : l'orienter.\n\nRetiens : chaque rôle compte.",
    );
  });

  it("préserve les explications déjà rédigées en Markdown", () => {
    const markdown = "Un point important.\n\n- Première idée\n- Deuxième idée";
    expect(formatQuizExplanation(markdown)).toBe(markdown);
  });
});
