import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import QuizMarkdown from "./quiz-markdown";

describe("explications de quiz", () => {
  it("affiche les puces de l'IA comme une liste et la conclusion à part", () => {
    const html = renderToStaticMarkup(
      <QuizMarkdown explanation>
        {"• Accueil : recevoir le client. • Conseil : l'orienter. Retiens : chaque rôle compte."}
      </QuizMarkdown>,
    );

    expect(html.match(/<li /g)).toHaveLength(2);
    expect(html).toContain("<p>Retiens : chaque rôle compte.</p>");
  });
});
