import { parseParcoursImportOptions } from "../parcours-import-options.ts";

describe("options d'import d'un parcours", () => {
  it("accepte une ressource pédagogique et déduplique les modules sélectionnés", () => {
    expect(
      parseParcoursImportOptions({
        formationId: "3",
        teacherContactId: "7",
        teacherModuleIndexes: "[0,2,2]",
        publishCourses: "true",
      }),
    ).toEqual({
      formationId: 3,
      teacherContactId: 7,
      teacherModuleIndexes: [0, 2],
      publishCourses: true,
    });
  });

  it("refuse des modules sans ressource pédagogique", () => {
    expect(() =>
      parseParcoursImportOptions({ teacherModuleIndexes: "[0]" }),
    ).toThrow("Une ressource pédagogique doit être sélectionnée");
  });

  it("refuse une sélection de modules invalide", () => {
    expect(() =>
      parseParcoursImportOptions({
        teacherContactId: "7",
        teacherModuleIndexes: "[-1]",
      }),
    ).toThrow("La sélection des modules n'est pas valide");
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
