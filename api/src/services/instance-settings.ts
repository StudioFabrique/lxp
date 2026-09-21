import fs from "fs";
import path from "path";

export type InstanceSettings = {
  name: string;
  setupCompleted: boolean;
  enabledThemes: string[];
};

export const defaultInstanceSettings: InstanceSettings = {
  name: "ANDRIA",
  setupCompleted: false,
  enabledThemes: [
    "classic", "ocean", "linen", "sage",
    "classic-dark", "aurora", "ember", "abyss",
  ],
};

const settingsPath = path.join(
  import.meta.dirname,
  "..",
  "..",
  "uploads",
  "instance",
  "instance-settings.json",
);

export const instanceLogoPath = path.join(
  import.meta.dirname,
  "..",
  "..",
  "uploads",
  "instance",
  "instance-logo.jpeg",
);

export const instanceColorPath = path.join(
  import.meta.dirname,
  "..",
  "..",
  "uploads",
  "instance",
  "instance-color.txt",
);

export async function hasInstanceLogo() {
  try {
    await fs.promises.access(instanceLogoPath, fs.constants.F_OK);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw error;
  }
}

export async function readInstanceSettings(): Promise<InstanceSettings> {
  try {
    const saved = JSON.parse(await fs.promises.readFile(settingsPath, "utf8"));
    return {
      name:
        typeof saved.name === "string"
          ? saved.name
          : defaultInstanceSettings.name,
      setupCompleted:
        typeof saved.setupCompleted === "boolean"
          ? saved.setupCompleted
          : defaultInstanceSettings.setupCompleted,
      enabledThemes: Array.isArray(saved.enabledThemes)
        ? saved.enabledThemes.filter((theme: unknown): theme is string => typeof theme === "string")
        : defaultInstanceSettings.enabledThemes,
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return defaultInstanceSettings;
    }
    throw error;
  }
}

export async function writeInstanceSettings(settings: InstanceSettings) {
  await fs.promises.mkdir(path.dirname(settingsPath), { recursive: true });
  const temporaryPath = `${settingsPath}.tmp`;
  await fs.promises.writeFile(
    temporaryPath,
    `${JSON.stringify(settings, null, 2)}\n`,
    "utf8",
  );
  await fs.promises.rename(temporaryPath, settingsPath);
}
