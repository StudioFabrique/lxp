import { describe, expect, it } from "vitest";
import {
  addCreatedContactToReturnPath,
  createContactUrlFromParcours,
  getSafeParcoursReturnPath,
} from "./parcours-contact-creation";

describe("parcours-contact-creation", () => {
  it("mène à la création d'utilisateur avec retour sur les informations du parcours", () => {
    const url = new URL(createContactUrlFromParcours(12), "http://lxp.local");
    expect(url.pathname).toBe("/admin/user/add");
    expect(url.searchParams.get("returnTo")).toBe("/admin/parcours/edit/12?step=1");
    expect(url.searchParams.get("roleRank")).toBe("2");
  });

  it("n'accepte que le retour vers l'édition d'un parcours", () => {
    expect(getSafeParcoursReturnPath("/admin/parcours/edit/12?step=1")).toBe("/admin/parcours/edit/12?step=1");
    expect(getSafeParcoursReturnPath("//evil.test/admin/parcours/edit/12")).toBeNull();
    expect(getSafeParcoursReturnPath("https://evil.test")).toBeNull();
    expect(getSafeParcoursReturnPath("/admin/user")).toBeNull();
    expect(getSafeParcoursReturnPath(null)).toBeNull();
  });
});

describe("addCreatedContactToReturnPath", () => {
  it("conserve l'étape et ajoute le contact créé", () => {
    expect(addCreatedContactToReturnPath("/admin/parcours/edit/12?step=1", "abc")).toBe(
      "/admin/parcours/edit/12?step=1&createdContact=abc",
    );
  });
});
