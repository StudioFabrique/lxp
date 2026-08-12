import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import type User from "../../../utils/interfaces/user";
import { getUsersColumns } from "./user-table-columns";

const createUser = (role: string): User => ({
  _id: `${role}-id`,
  email: `${role}@example.com`,
  firstname: "Camille",
  lastname: "Martin",
  roles: [
    {
      _id: `${role}-role-id`,
      role,
      label: role,
      rank: 1,
      protection: 0,
    },
  ],
  isActive: true,
  invitationSent: false,
  abilityRules: [],
});

const renderActions = (user: User) => {
  const columns = getUsersColumns(
    () => undefined,
    () => undefined,
    () => undefined,
  );
  const actionsCell = columns[columns.length - 1]?.cell;

  expect(typeof actionsCell).toBe("function");
  if (typeof actionsCell !== "function") return "";

  return renderToStaticMarkup(
    <MemoryRouter>
      {actionsCell({ row: { original: user } } as never)}
    </MemoryRouter>,
  );
};

describe("getUsersColumns", () => {
  it("affiche la consultation des statistiques pour un étudiant", () => {
    const markup = renderActions(createUser("student"));

    expect(markup).toContain('href="/admin/user/data/student-id"');
    expect(markup).toContain("Consulter les statistiques de Camille Martin");
  });

  it("masque la consultation des statistiques pour les autres rôles", () => {
    const markup = renderActions(createUser("teacher"));

    expect(markup).not.toContain("/admin/user/data/");
    expect(markup).not.toContain("Consulter les statistiques");
  });
});
