import notes from "./release-notes.json";

export type ReleaseNote = {
  version: string;
  status: string;
  branch?: string;
  summary: string;
  changes: { title: string; description: string }[];
};

// La première entrée est affichée dans la carte et la fenêtre des nouveautés.
export const releaseNotes: ReleaseNote[] = notes;

export const currentRelease = releaseNotes[0];
