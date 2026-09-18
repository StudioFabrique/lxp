import fs from "fs";
import path from "path";

export type InstanceSettings = {
  name: string;
  setupCompleted: boolean;
  defaultTheme: string;
  welcomeTitles: {
    admin: string;
    teacher: string;
    student: string;
  };
  welcomeMessages: {
    admin: string;
    teacher: string;
    student: string;
  };
};

export const defaultInstanceSettings: InstanceSettings = {
  name: "ANDRIA",
  setupCompleted: false,
  defaultTheme: "classic",
  welcomeTitles: {
    admin: "Bonjour, {firstname} {lastname} !",
    teacher: "Bonjour, {firstname} {lastname} !",
    student: "Bonjour, {firstname} {lastname} !",
  },
  welcomeMessages: {
    admin:
      "Bienvenue dans votre panneau d'administration, l'outil central pour gérer et surveiller tous les aspects de l'apprentissage de vos apprenants",
    teacher:
      "Bienvenue dans votre espace pédagogique, retrouvez vos contenus et accompagnez vos apprenants",
    student:
      "Bienvenue dans votre espace, commencez votre apprentissage ou reprenez là où vous vous êtes arrêté",
  },
};

const settingsPath = path.join(
  import.meta.dirname,
  "..",
  "..",
  "uploads",
  "company",
  "instance-settings.json",
);

const companyLogoPath = path.join(
  import.meta.dirname,
  "..",
  "..",
  "uploads",
  "company",
  "company-logo.jpeg",
);

export async function hasCompanyLogo() {
  try {
    await fs.promises.access(companyLogoPath, fs.constants.F_OK);
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
      name: typeof saved.name === "string" ? saved.name : defaultInstanceSettings.name,
      setupCompleted:
        typeof saved.setupCompleted === "boolean"
          ? saved.setupCompleted
          : defaultInstanceSettings.setupCompleted,
      defaultTheme:
        typeof saved.defaultTheme === "string"
          ? saved.defaultTheme === "light"
            ? "classic"
            : saved.defaultTheme === "dark"
              ? "classic-dark"
              : saved.defaultTheme
          : "classic",
      welcomeTitles: {
        ...defaultInstanceSettings.welcomeTitles,
        ...(saved.welcomeTitles ?? {}),
      },
      welcomeMessages: {
        ...defaultInstanceSettings.welcomeMessages,
        ...(saved.welcomeMessages ?? {}),
      },
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
