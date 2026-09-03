import {
  isContentAllowedForScope,
  moduleWhereForScope,
} from "../../utils/services/permissions/accessible-parcours.ts";

const teacherScope = {
  kind: "teacher" as const,
  parcoursIds: [3, 8],
  directParcoursIds: [3, 8],
  moduleIds: [12, 21],
};

describe("périmètre d'accès aux modules", () => {
  it("limite un formateur aux modules qui lui sont directement affectés", () => {
    expect(
      moduleWhereForScope(teacherScope),
    ).toEqual({ id: { in: [12, 21] } });
  });

  it("ne retourne aucun module à un formateur sans affectation", () => {
    expect(
      moduleWhereForScope({
        kind: "teacher",
        parcoursIds: [3],
        directParcoursIds: [3],
        moduleIds: [],
      }),
    ).toEqual({ id: { in: [] } });
  });

  it("autorise la suppression d'une leçon de l'un de ses modules", () => {
    expect(
      isContentAllowedForScope(teacherScope, "lesson", "DELETE", {
        parcoursId: 3,
        moduleId: 12,
      }),
    ).toBe(true);
  });

  it("refuse la suppression d'une leçon d'un module non affecté", () => {
    expect(
      isContentAllowedForScope(teacherScope, "lesson", "DELETE", {
        parcoursId: 3,
        moduleId: 13,
      }),
    ).toBe(false);
  });
});
