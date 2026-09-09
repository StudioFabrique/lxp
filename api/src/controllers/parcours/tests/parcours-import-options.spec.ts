import { parseParcoursImportOptions } from "../parcours-import-options.ts";

describe("options d'import d'un parcours", () => {
  it("accepte la formation et l'option de publication", () => {
    expect(
      parseParcoursImportOptions({
        formationId: "3",
        createFormation: "false",
        publishCourses: "true",
      }),
    ).toEqual({
      formationId: 3,
      createFormation: false,
      publishCourses: true,
    });
  });

  it("ignore les anciennes options d'affectation de formateur", () => {
    expect(
      parseParcoursImportOptions({
        teacherContactId: "7",
        teacherModuleIndexes: "[0,2]",
      }),
    ).toEqual({ createFormation: false, publishCourses: false });
  });

  it("laisse les cours en brouillon par défaut", () => {
    expect(parseParcoursImportOptions({})).toMatchObject({
      createFormation: false,
      publishCourses: false,
    });
  });

  it("accepte la création automatique d'une formation", () => {
    expect(
      parseParcoursImportOptions({ createFormation: "true" }),
    ).toEqual({ createFormation: true, publishCourses: false });
  });

  it("refuse de sélectionner et de créer une formation simultanément", () => {
    expect(() =>
      parseParcoursImportOptions({
        formationId: "3",
        createFormation: "true",
      }),
    ).toThrow("pas les deux");
  });

  it("refuse une option de publication invalide", () => {
    expect(() =>
      parseParcoursImportOptions({ publishCourses: "oui" }),
    ).toThrow("L'option de publication des cours n'est pas valide");
  });
});
