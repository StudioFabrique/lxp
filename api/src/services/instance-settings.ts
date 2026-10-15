import fs from "fs";
import path from "path";

/**
 * Libellés affichés pour les rôles de l'interface, indexés par rang
 * (1 = administrateur, 2 = équipe pédagogique, 3 = apprenant, 4 = visiteur).
 * Le rang 0 (root) n'est pas renommable.
 */
export const roleLabelRanks = ["1", "2", "3", "4"] as const;
export type RoleLabelRank = (typeof roleLabelRanks)[number];
export type RoleLabels = Record<RoleLabelRank, string>;

export const roleLabelMinLength = 2;
export const roleLabelMaxLength = 40;

export const defaultRoleLabels: RoleLabels = {
  "1": "Administrateur",
  "2": "Équipe pédagogique",
  "3": "Apprenant",
  "4": "Visiteur",
};

export type InstanceSettings = {
  name: string;
  website: string;
  setupCompleted: boolean;
  enabledThemes: string[];
  emailTemplate: EmailTemplateId;
  roleLabels: RoleLabels;
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
  roleLabels: defaultRoleLabels,
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

/**
 * Les libellés viennent d'un fichier modifiable : un libellé absent ou hors
 * bornes retombe sur sa valeur par défaut plutôt que de casser l'interface.
 */
function readRoleLabels(saved: unknown): RoleLabels {
  const source =
    typeof saved === "object" && saved !== null
      ? (saved as Record<string, unknown>)
      : {};
  return Object.fromEntries(
    roleLabelRanks.map((rank) => {
      const value = source[rank];
      const label = typeof value === "string" ? value.trim() : "";
      return [
        rank,
        label.length >= roleLabelMinLength && label.length <= roleLabelMaxLength
          ? label
          : defaultRoleLabels[rank],
      ];
    }),
  ) as RoleLabels;
}

export type RoleLabelsResult =
  | { labels: RoleLabels }
  | { error: string };

/**
 * `roleLabels` voyage en JSON dans le multipart. Absent, il laisse les
 * libellés actuels inchangés ; présent, il doit être complet et sans doublon,
 * sinon deux espaces s'afficheraient sous le même nom.
 */
export function parseRoleLabels(
  raw: unknown,
  current: RoleLabels,
): RoleLabelsResult {
  if (raw === undefined) return { labels: current };
  const invalid = { error: "Les libellés des rôles sont invalides." };
  if (typeof raw !== "string") return invalid;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return invalid;
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return invalid;
  }
  const source = parsed as Record<string, unknown>;
  if (Object.keys(source).some((key) => !roleLabelRanks.some((rank) => rank === key))) {
    return invalid;
  }
  const entries: [string, string][] = [];
  for (const rank of roleLabelRanks) {
    const value = source[rank];
    if (typeof value !== "string") return invalid;
    const label = value.trim().replace(/\s+/g, " ");
    // Les caractères de contrôle et `<` `>` n'ont pas leur place dans un nom de rôle.
    if (
      label.length < roleLabelMinLength ||
      label.length > roleLabelMaxLength ||
      /[\u0000-\u001f\u007f<>]/.test(label)
    ) {
      return {
        error: `Chaque libellé de rôle doit contenir entre ${roleLabelMinLength} et ${roleLabelMaxLength} caractères, sans chevrons.`,
      };
    }
    entries.push([rank, label]);
  }
  const unique = new Set(entries.map(([, label]) => label.toLocaleLowerCase("fr")));
  if (unique.size !== entries.length) {
    return { error: "Chaque rôle doit porter un libellé différent." };
  }
  return { labels: Object.fromEntries(entries) as RoleLabels };
}

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
      roleLabels: readRoleLabels(saved.roleLabels),
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
