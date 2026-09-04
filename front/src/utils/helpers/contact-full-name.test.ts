import { describe, expect, it } from "vitest";
import { getContactFullName } from "./contact-full-name";

describe("getContactFullName", () => {
  it("assemble le prénom et le nom", () => {
    expect(
      getContactFullName({ firstname: "Camille", lastname: "Martin" }),
    ).toBe("Camille Martin");
  });

  it("affiche un libellé générique quand la ressource n'existe plus", () => {
    expect(getContactFullName({ firstname: "", lastname: "" })).toBe(
      "Ressource supprimée",
    );
  });
});
