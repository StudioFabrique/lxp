import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import StudentsList from "./students-list";

vi.mock("../../../../../components/UI/search/search.component", () => ({
  default: () => null,
}));

describe("StudentsList", () => {
  it("conserve le parcours d'origine dans le lien de modification", () => {
    const markup = renderToStaticMarkup(
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
      </MemoryRouter>,
    );

    expect(markup).toContain(
      'href="/admin/group/edit/group-id?parcours=42"',
    );
  });
});
