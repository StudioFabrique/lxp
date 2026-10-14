import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { courseApi } from "../../../course/api/course.api";
import type { LessonWithActivitiesCount } from "../../../../utils/interfaces/lesson";
import CourseContentImport from "./course-content-import";

const renderImport = (
  contents: LessonWithActivitiesCount[],
  tags = [{ id: 1, name: "Maths", color: "#3366ff" }],
) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  // Sans tag choisi, la liste vient de la requête non filtrée, limitée à 20 contenus par source.
  queryClient.setQueryData(
    courseApi.queries.lessonsToImport(20, false, true).queryKey,
    { data: contents },
  );

  return renderToStaticMarkup(
    <QueryClientProvider client={queryClient}>
      <CourseContentImport
        parcoursTags={tags}
        selectedContents={[]}
        onSelectedContentsChange={vi.fn()}
      />
    </QueryClientProvider>,
  );
};

describe("CourseContentImport", () => {
  it("affiche les contenus de tous les tags, avec leur tag, tant qu'aucun tag n'est choisi", () => {
    const markup = renderImport([
      {
        id: 1,
        title: "Fractions",
        activitiesCount: 2,
        source: "resource",
        tag: { id: 1, name: "Maths", color: "#3366ff" },
      },
      {
        id: 2,
        title: "Les verbes",
        activitiesCount: 0,
        source: "resource",
        tag: { id: 2, name: "Français", color: "#ff6633" },
      },
    ]);

    expect(markup).toContain("Fractions");
    expect(markup).toContain("#Français");
    expect(markup).not.toContain("Choisissez un tag");
  });

  it("signale l'absence de contenu quand la liste est vide", () => {
    expect(renderImport([])).toContain(
      "Aucun contenu disponible pour le moment.",
    );
  });

  it("invite à ajouter un tag au module quand il n'en a aucun et qu'il n'y a rien à proposer", () => {
    // L'apostrophe est encodée dans le HTML rendu.
    expect(renderImport([], [])).toMatch(
      /Aucun tag n.{1,6}est associé à ce module/,
    );
  });
});
