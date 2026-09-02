import {
  isSafeAssetPath,
  parseParcoursArchiveManifest,
  parcoursArchiveFormat,
} from "../parcours-archive.ts";

function validManifest() {
  return {
    format: parcoursArchiveFormat.name,
    version: parcoursArchiveFormat.version,
    exportedAt: "2026-09-02T10:00:00.000Z",
    warnings: [],
    formation: {
      title: "Formation portable",
      description: null,
      code: null,
      level: "Débutant",
    },
    parcours: {
      title: "Parcours portable",
      description: null,
      startDate: null,
      endDate: null,
      degree: null,
      virtualClass: null,
      visibility: false,
      isPublished: false,
      image: null,
      thumb: null,
      objectives: [],
      tags: [],
      skills: [],
      bonusSkills: [],
      modules: [],
    },
  };
}

describe("format d'archive des parcours", () => {
  it("accepte le manifeste minimal de la version courante", () => {
    expect(parseParcoursArchiveManifest(validManifest())).toMatchObject({
      format: "andria-parcours",
      version: 1,
    });
  });

  it("refuse une autre version du format", () => {
    expect(() =>
      parseParcoursArchiveManifest({ ...validManifest(), version: 2 }),
    ).toThrow("n'est pas valide");
  });

  it("refuse les chemins qui sortent du dossier assets", () => {
    expect(isSafeAssetPath("assets/modules/1/image.webp")).toBe(true);
    expect(isSafeAssetPath("assets/../manifest.json")).toBe(false);
    expect(isSafeAssetPath("manifest.json")).toBe(false);

    const manifest = validManifest();
    manifest.parcours.image = {
      kind: "asset",
      path: "assets/../manifest.json",
    } as never;
    expect(() => parseParcoursArchiveManifest(manifest)).toThrow(
      "n'est pas valide",
    );
  });
});
