import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import SidebarItem from "./SidebarItem";

const render = (
  itemPath: string,
  extra: { alsoActiveOn?: string[]; notActiveOn?: string[] } = {},
) =>
  renderToStaticMarkup(
    <MemoryRouter>
      <SidebarItem
        currentRoute={["admin", "parcours", "module", "7"]}
        itemPath={itemPath}
        linkTo={`/admin/${itemPath}`}
        icon={null}
        {...extra}
      >
        Entrée
      </SidebarItem>
    </MemoryRouter>,
  );

describe("SidebarItem", () => {
  it("active l'entrée dont le chemin est un préfixe de la route", () => {
    expect(render("parcours")).toContain("sidebar-active");
    expect(render("group")).not.toContain("sidebar-active");
  });

  it("exclut un chemin réservé à une autre entrée", () => {
    expect(render("parcours", { notActiveOn: ["parcours/module"] })).not.toContain("sidebar-active");
  });

  it("active l'entrée pour un chemin supplémentaire", () => {
    expect(render("module", { alsoActiveOn: ["parcours/module"] })).toContain("sidebar-active");
  });
});
