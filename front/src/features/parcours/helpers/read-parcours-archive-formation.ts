import JSZip from "jszip";

type ParcoursArchiveManifest = {
  formation?: {
    title?: unknown;
  };
};

type FormationItem = {
  id: number;
  title: string;
};

export function findDetectedFormationId(
  formations: FormationItem[],
  detectedTitle: string,
) {
  return formations.find(
    (formation) =>
      formation.title.trim().localeCompare(detectedTitle.trim(), "fr", {
        sensitivity: "base",
      }) === 0,
  )?.id;
}

export async function readParcoursArchiveFormationTitle(archive: File) {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(archive);
  } catch {
    throw new Error("Le fichier ZIP est invalide ou corrompu.");
  }

  const manifestFile = zip.file("manifest.json");
  if (!manifestFile) {
    throw new Error("Le fichier manifest.json est absent de l’archive.");
  }

  let manifest: ParcoursArchiveManifest;
  try {
    manifest = JSON.parse(await manifestFile.async("text"));
  } catch {
    throw new Error("Le manifeste JSON est invalide.");
  }

  const formationTitle = manifest.formation?.title;
  if (typeof formationTitle !== "string" || formationTitle.trim() === "") {
    throw new Error("La formation est absente du manifeste.");
  }

  return formationTitle.trim();
}
