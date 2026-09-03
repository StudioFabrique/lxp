import JSZip from "jszip";
import { describe, expect, it } from "vitest";

import {
  findDetectedFormationId,
  readParcoursArchiveMetadata,
  readParcoursArchiveFormationTitle,
} from "./read-parcours-archive-formation";

async function archiveWithManifest(manifest: unknown) {
  const zip = new JSZip();
  zip.file("manifest.json", JSON.stringify(manifest));
  const content = await zip.generateAsync({ type: "blob" });
  return new File([content], "parcours.zip", { type: "application/zip" });
}

describe("readParcoursArchiveFormationTitle", () => {
  it("retourne le titre de la formation du manifeste", async () => {
    const archive = await archiveWithManifest({
      formation: { title: " Formation détectée " },
      parcours: { modules: [] },
    });

    await expect(readParcoursArchiveFormationTitle(archive)).resolves.toBe(
      "Formation détectée",
    );
  });

  it("retourne les modules disponibles pour l’affectation du formateur", async () => {
    const archive = await archiveWithManifest({
      formation: { title: "Formation" },
      parcours: {
        modules: [{ title: " Module 1 " }, { title: "Module 2" }],
      },
    });

    await expect(readParcoursArchiveMetadata(archive)).resolves.toEqual({
      formationTitle: "Formation",
      modules: [
        { index: 0, title: "Module 1" },
        { index: 1, title: "Module 2" },
      ],
    });
  });

  it("refuse une archive sans manifeste", async () => {
    const content = await new JSZip().generateAsync({ type: "blob" });
    const archive = new File([content], "parcours.zip");

    await expect(readParcoursArchiveFormationTitle(archive)).rejects.toThrow(
      "manifest.json",
    );
  });
});

describe("findDetectedFormationId", () => {
  it("retrouve la formation détectée sans tenir compte de la casse ni des accents", () => {
    const formations = [
      { id: 1, title: "Commerce" },
      { id: 2, title: "Développement web" },
    ];

    expect(findDetectedFormationId(formations, "developpement WEB")).toBe(2);
  });

  it("ne présélectionne rien lorsqu'aucune formation ne correspond", () => {
    expect(
      findDetectedFormationId([{ id: 1, title: "Commerce" }], "Design"),
    ).toBeUndefined();
  });
});
