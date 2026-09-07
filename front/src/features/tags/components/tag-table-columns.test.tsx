import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router";

import type { TagRow } from "../api/tag.api";
import { getTagColumns } from "./tag-table-columns";

describe("getTagColumns", () => {
  it("affiche le titre du tag avec sa couleur", () => {
    const tag: TagRow = {
      id: 1,
      name: "Design",
      color: "rgb(12, 34, 56)",
      canDelete: true,
      canUpdate: true,
      totalUses: 0,
      parcours: [],
    };
    const titleCell = getTagColumns(() => undefined)[1].cell;

    expect(typeof titleCell).toBe("function");
    if (typeof titleCell !== "function") return;

    const markup = renderToStaticMarkup(
      titleCell({ row: { original: tag } } as never),
    );

    expect(markup).toContain("#Design");
    expect(markup).toContain("background-color:rgb(12, 34, 56)");
  });

  it("masque les actions d'un tag qui appartient à une autre équipe", () => {
    const tag: TagRow = {
      id: 2,
      name: "Administration",
      color: "rgb(12, 34, 56)",
      canDelete: false,
      canUpdate: false,
      totalUses: 0,
      parcours: [],
    };
    const actionsCell = getTagColumns(() => undefined)[4].cell;

    expect(typeof actionsCell).toBe("function");
    if (typeof actionsCell !== "function") return;

    const markup = renderToStaticMarkup(
      <MemoryRouter>
        {actionsCell({ row: { original: tag } } as never)}
      </MemoryRouter>,
    );

    expect(markup).not.toContain("Modifier");
    expect(markup).not.toContain("Supprimer");
  });

  it("affiche les actions d'un tag appartenant à l'utilisateur", () => {
    const tag: TagRow = {
      id: 3,
      name: "Pédagogie",
      color: "rgb(12, 34, 56)",
      canDelete: true,
      canUpdate: true,
      totalUses: 0,
      parcours: [],
    };
    const actionsCell = getTagColumns(() => undefined)[4].cell;

    expect(typeof actionsCell).toBe("function");
    if (typeof actionsCell !== "function") return;

    const markup = renderToStaticMarkup(
      <MemoryRouter>
        {actionsCell({ row: { original: tag } } as never)}
      </MemoryRouter>,
    );

    expect(markup).toContain("Modifier");
    expect(markup).toContain("Supprimer");
  });
});
