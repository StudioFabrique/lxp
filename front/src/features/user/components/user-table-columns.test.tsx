import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import type User from "../../../utils/interfaces/user";
import { getUsersColumns } from "./user-table-columns";

const createUser = (role: string, overrides: Partial<User> = {}): User => ({
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
  ...overrides,
});

const renderCell = (user: User, columnId: string) => {
  const columns = getUsersColumns(
    () => undefined,
    () => undefined,
    () => undefined,
  );
  const cell = columns.find((column) => column.id === columnId)?.cell;
  if (!cell) return "";

  expect(typeof cell).toBe("function");
  if (typeof cell !== "function") return "";

  return renderToStaticMarkup(
    <MemoryRouter>{cell({ row: { original: user } } as never)}</MemoryRouter>,
  );
};

describe("getUsersColumns", () => {
  describe("état de l'invitation", () => {
    // L'invitation part après la réponse de création : tant que le serveur SMTP
    // n'a pas remis le message, proposer le renvoi induirait en erreur.
    const enAttente = createUser("student", {
      isActive: false,
      invitationSent: false,
      invitationPending: true,
    });

    it("montre un indicateur d'attente pendant la remise", () => {
      const markup = renderCell(enAttente, "actions");

      expect(markup).toContain("animate-spin");
      expect(markup).toContain(
        "Invitation en cours d&#x27;envoi à Camille Martin",
      );
      expect(markup).not.toContain("Envoyer une invitation");
    });

    it("propose l'envoi quand aucune invitation n'est en cours", () => {
      const markup = renderCell(
        createUser("student", { isActive: false, invitationSent: false }),
        "actions",
      );

      expect(markup).toContain("Envoyer une invitation");
      expect(markup).not.toContain("animate-spin");
    });

    it("propose le renvoi une fois l'invitation remise", () => {
      const markup = renderCell(
        createUser("student", { isActive: false, invitationSent: true }),
        "actions",
      );

      expect(markup).toContain("Cliquez pour renvoyer");
      expect(markup).not.toContain("animate-spin");
    });
  });
});
