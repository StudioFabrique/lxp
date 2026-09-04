import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import type Role from "../../../../../utils/interfaces/role";
import StudentGroupList from "./student-group-list";

const role: Role = {
  _id: "student-role",
  role: "student",
  label: "Apprenant",
  rank: 3,
  protection: 1,
};

describe("StudentGroupList", () => {
  it("place la création d'un groupe en haut à droite du tableau", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <StudentGroupList
          role={role}
          allChecked={false}
          groupList={[
            {
              _id: "group-id",
              name: "Groupe A",
              desc: "",
              formation: "Formation A",
              nbStudents: 12,
              users: [],
              isActive: true,
              isSelected: false,
            },
          ]}
          onRowCheck={vi.fn()}
          onAllChecked={vi.fn()}
          onSorting={vi.fn()}
          fieldSort="name"
          direction={true}
          createGroupHref="/admin/group/add?parcours=1"
        />
      </MemoryRouter>,
    );

    expect(markup).toContain("Nom");
    expect(markup).toContain("Formation / Parcours");
    expect(markup).toContain("Nombre d&#x27;étudiants");
    expect(markup).toContain("flex justify-end");
    expect(markup).toContain("Créer un groupe");
    expect(markup).toContain('href="/admin/group/add?parcours=1"');
    expect(markup.indexOf("Créer un groupe")).toBeLessThan(
      markup.indexOf("<table"),
    );
  });

  it("affiche un message lorsque le tableau est vide", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <StudentGroupList
          role={role}
          allChecked={false}
          groupList={[]}
          onRowCheck={vi.fn()}
          onAllChecked={vi.fn()}
          onSorting={vi.fn()}
          fieldSort="name"
          direction={true}
          createGroupHref="/admin/group/add?parcours=1"
        />
      </MemoryRouter>,
    );

    expect(markup).toContain("Aucun groupe disponible");
    expect(markup).not.toContain("<table");
    expect(markup).not.toContain("Formation / Parcours");
  });
});
