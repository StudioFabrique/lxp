import { includeCreatorContact } from "../module-contact-ids.ts";

describe("affectation du créateur d'un module", () => {
  it("affecte automatiquement le formateur créateur présent sur le parcours", () => {
    expect(includeCreatorContact([], new Set([7, 9]), 7)).toEqual([7]);
  });

  it("ne duplique pas le formateur lorsqu'il a déjà été sélectionné", () => {
    expect(includeCreatorContact([7, 9], new Set([7, 9]), 7)).toEqual([7, 9]);
  });

  it("n'affecte pas un contact qui n'appartient pas au parcours", () => {
    expect(includeCreatorContact([9], new Set([9]), 7)).toEqual([9]);
  });
});
