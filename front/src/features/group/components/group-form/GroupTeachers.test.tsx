import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import type Group from "../../../../utils/interfaces/group";
import GroupTeachers from "./GroupTeachers";

const group = { name: "Promotion", parcoursId: 42, teachers: [{
  _id: "teacher", firstname: "Alice", lastname: "Martin", email: "alice@example.com",
  isActive: true, isCreator: true, parcours: [{ id: 42, title: "Parcours test" }],
}] } as Group;

describe("formateurs liés au groupe", () => {
  it("affiche les formateurs et le lien vers la modification du parcours associé", () => {
    const html = renderToStaticMarkup(<MemoryRouter><GroupTeachers group={group} /></MemoryRouter>);
    expect(html).toContain("Alice");
    expect(html).toContain("Martin");
    expect(html).not.toContain("alice@example.com");
    expect(html).not.toContain("Créateur du groupe");
    expect(html).toContain('href="/admin/parcours/edit/42"');
  });
  it("affiche un état vide sans lien lorsqu’aucun parcours n’est associé", () => {
    const html = renderToStaticMarkup(<MemoryRouter><GroupTeachers group={{ ...group, parcoursId: undefined, teachers: [] }} /></MemoryRouter>);
    expect(html).toContain("Aucun formateur lié");
    expect(html).not.toContain("href=");
  });
});
