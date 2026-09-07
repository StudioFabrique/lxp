import { parseParcoursImportOptions } from "../parcours-import-options.ts";

describe("options d'import d'un parcours", () => {
  it("accepte la formation et l'option de publication", () => {
    expect(
      parseParcoursImportOptions({
        formationId: "3",
        publishCourses: "true",
      }),
    ).toEqual({
      formationId: 3,
      publishCourses: true,
    });
  });

  it("ignore les anciennes options d'affectation de formateur", () => {
    expect(
      parseParcoursImportOptions({
        teacherContactId: "7",
        teacherModuleIndexes: "[0,2]",
      }),
    ).toEqual({ publishCourses: false });
  });

  it("laisse les cours en brouillon par défaut", () => {
    expect(parseParcoursImportOptions({})).toMatchObject({
      publishCourses: false,
    });
  });

  it("refuse une option de publication invalide", () => {
    expect(() =>
      parseParcoursImportOptions({ publishCourses: "oui" }),
    ).toThrow("L'option de publication des cours n'est pas valide");
  });
});
