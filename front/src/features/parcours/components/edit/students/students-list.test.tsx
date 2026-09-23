import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { StudentWithGroup } from "../../../hooks/useParcoursStudentsQuery";

import StudentsList from "./students-list";

vi.mock("../../../../../components/UI/search/search.component", () => ({
  default: () => null,
}));

describe("StudentsList", () => {
  it("affiche les apprenants dans le tableau partagé", () => {
    const student = {
      _id: "student-id",
      firstname: "Martin",
      lastname: "Dhollande",
      email: "martin@example.com",
      group: { _id: "group-id", name: "groupe test" },
    } as StudentWithGroup;
    const markup = renderToStaticMarkup(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <StudentsList
            initalList={[student]}
            parcoursId={42}
            groups={[]}
            onRemoveGroup={vi.fn()}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(markup).toContain('class="data-table');
    expect(markup).toContain("martin@example.com");
    expect(markup).toContain("Apprenants : 1");
    expect(markup).toContain("Rechercher un apprenant");
  });

  it("conserve le parcours d'origine dans le lien de modification", () => {
    const markup = renderToStaticMarkup(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <StudentsList
          initalList={[]}
          parcoursId={42}
          groups={[
            {
              _id: "group-id",
              name: "groupe test",
              desc: "",
              startDate: "",
              endDate: "",
              tags: [],
            },
          ]}
          onRemoveGroup={vi.fn()}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(markup).toContain(
      'href="/admin/group/edit/group-id?parcours=42"',
    );
  });
});
