import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import SkillBadgeSummary from "./skill-badge-summary";

vi.mock("../../../components/skills/skill-badge", () => ({
  default: ({ skill }: { skill: { description: string } }) => (
    <span data-skill-badge>{skill.description}</span>
  ),
}));

it("affiche deux badges au maximum et indique combien restent masqués", () => {
  const markup = renderToStaticMarkup(
    <SkillBadgeSummary
      skills={[
        { id: 1, description: "Accueil" },
        { id: 2, description: "Écoute" },
        { id: 3, description: "Conseil" },
        { id: 4, description: "Suivi" },
        { id: 5, description: "Fidélisation" },
      ]}
    />,
  );

  expect(markup.match(/data-skill-badge/g)).toHaveLength(2);
  expect(markup).toContain("Accueil");
  expect(markup).toContain("Écoute");
  expect(markup).not.toContain("Conseil");
  expect(markup).toContain("+3");
  expect(markup).toContain("3 badges supplémentaires");
});

it("n'affiche pas de compteur quand tous les badges sont visibles", () => {
  const markup = renderToStaticMarkup(
    <SkillBadgeSummary skills={[{ id: 1, description: "Accueil" }]} />,
  );

  expect(markup.match(/data-skill-badge/g)).toHaveLength(1);
  expect(markup).not.toContain("supplémentaire");
});
