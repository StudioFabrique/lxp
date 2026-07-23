import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const activityDirectory: Record<string, string> = {
  video: "videos",
  image: "images",
  resource: "files",
};

/** Copies a locally uploaded activity file and returns its new public filename. */
export async function duplicateActivityFile(url: string, type: string) {
  const directory = activityDirectory[type];
  if (!directory || !url || url.includes("://")) return url;

  const filename = path.basename(url);
  const uploadsDirectory = path.join(
    __dirname,
    "..",
    "..",
    "uploads",
    "activities",
    directory,
  );
  const source = path.join(uploadsDirectory, filename);
  const duplicate = `${randomUUID()}${path.extname(filename)}`;

  try {
    await fs.copyFile(source, path.join(uploadsDirectory, duplicate));
    return duplicate;
  } catch {
    // Old/external contents may no longer have a local file. Keep them usable.
    return url;
  }
}
