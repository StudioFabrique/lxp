import fs from "fs";
import path from "path";

export type InstanceSettings = {
  name: string;
  website: string;
  setupCompleted: boolean;
  enabledThemes: string[];
  emailTemplate: EmailTemplateId;
};

export const emailTemplateIds = [
  "minimal",
  "gradient",
  "editorial",
  "soft",
  "contrast",
  "compact",
] as const;
export type EmailTemplateId = (typeof emailTemplateIds)[number];

export const defaultInstanceSettings: InstanceSettings = {
  name: "ANDRIA",
  website: "",
  setupCompleted: false,
  enabledThemes: [
    "classic", "ocean", "linen", "sage",
    "classic-dark", "aurora", "ember", "abyss",
  ],
  emailTemplate: "minimal",
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
      website:
        typeof saved.website === "string"
          ? saved.website
          : defaultInstanceSettings.website,
      setupCompleted:
        typeof saved.setupCompleted === "boolean"
          ? saved.setupCompleted
          : defaultInstanceSettings.setupCompleted,
      enabledThemes: Array.isArray(saved.enabledThemes)
        ? saved.enabledThemes.filter((theme: unknown): theme is string => typeof theme === "string")
        : defaultInstanceSettings.enabledThemes,
      emailTemplate: emailTemplateIds.includes(saved.emailTemplate)
        ? saved.emailTemplate
        : defaultInstanceSettings.emailTemplate,
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
