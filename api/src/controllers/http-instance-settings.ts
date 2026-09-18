import type { Response } from "express";
import type CustomRequest from "../utils/interfaces/express/custom-request.ts";
import fs from "fs";
import {
  hasInstanceLogo,
  instanceLogoPath,
  readInstanceSettings,
  writeInstanceSettings,
} from "../services/instance-settings.ts";

const allowedThemes = new Set([
  "classic",
  "ocean",
  "linen",
  "sage",
  "lavender",
  "sunrise",
  "glacier",
  "sand",
  "classic-dark",
  "aurora",
  "ember",
  "abyss",
  "graphite",
  "plum",
  "moss",
  "cobalt",
  "pearl", "mint", "blossom", "sky", "lemon", "clay", "ice", "paper",
  "midnight", "forest-night", "coffee", "amethyst", "storm", "wine", "teal-night", "obsidian",
]);

const lightThemes = new Set([
  "classic", "ocean", "linen", "sage", "lavender", "sunrise", "glacier", "sand",
  "pearl", "mint", "blossom", "sky", "lemon", "clay", "ice", "paper",
]);
const darkThemes = new Set([...allowedThemes].filter((theme) => !lightThemes.has(theme)));

export async function httpGetInstanceSettings(
  _req: CustomRequest,
  res: Response,
) {
  const [settings, hasLogo] = await Promise.all([
    readInstanceSettings(),
    hasInstanceLogo(),
  ]);
  res.json({ ...settings, hasLogo });
}

export async function httpPutInstanceSettings(
  req: CustomRequest,
  res: Response,
) {
  const { name } = req.body ?? {};
  const currentSettings = await readInstanceSettings();
  let titles: Record<string, unknown> | undefined;
  let messages: Record<string, unknown> | undefined;

  try {
    titles = JSON.parse(req.body?.welcomeTitles ?? "");
    messages = JSON.parse(req.body?.welcomeMessages ?? "");
  } catch {
    return res
      .status(400)
      .json({ message: "Les messages envoyés sont invalides." });
  }
  const titleValues = [titles?.admin, titles?.teacher, titles?.student];
  const messageValues = [messages?.admin, messages?.teacher, messages?.student];

  if (
    typeof name !== "string" ||
    name.trim().length < 2 ||
    name.trim().length > 80
  ) {
    return res.status(400).json({
      message: "Le nom de l’organisme doit contenir entre 2 et 80 caractères.",
    });
  }

  let enabledThemes: unknown;
  try {
    enabledThemes = JSON.parse(req.body?.enabledThemes ?? "");
  } catch {
    enabledThemes = null;
  }
  if (
    !Array.isArray(enabledThemes) ||
    enabledThemes.some((theme) => typeof theme !== "string" || !allowedThemes.has(theme)) ||
    !enabledThemes.some((theme) => lightThemes.has(theme)) ||
    !enabledThemes.some((theme) => darkThemes.has(theme))
  ) {
    return res
      .status(400)
      .json({ message: "Sélectionnez au moins un thème clair et un thème sombre." });
  }

  if (
    titleValues.some(
      (value) =>
        typeof value !== "string" ||
        value.trim().length < 2 ||
        value.trim().length > 120,
    ) ||
    messageValues.some(
      (value) =>
        typeof value !== "string" ||
        value.trim().length < 2 ||
        value.trim().length > 300,
    )
  ) {
    return res.status(400).json({
      message:
        "Les titres et sous-textes de bienvenue doivent contenir entre 2 et 120 ou 300 caractères respectivement.",
    });
  }

  const settings = {
    name: name.trim(),
    setupCompleted:
      req.body?.setupCompleted === "true"
        ? true
        : currentSettings.setupCompleted,
    enabledThemes: [...new Set(enabledThemes as string[])],
    welcomeTitles: {
      admin: (titles!.admin as string).trim(),
      teacher: (titles!.teacher as string).trim(),
      student: (titles!.student as string).trim(),
    },
    welcomeMessages: {
      admin: (messages!.admin as string).trim(),
      teacher: (messages!.teacher as string).trim(),
      student: (messages!.student as string).trim(),
    },
  };

  await writeInstanceSettings(settings);

  if (req.body?.deleteLogo === "true" && !req.file) {
    await fs.promises.rm(instanceLogoPath, { force: true });
  }

  res.json({ ...settings, hasLogo: await hasInstanceLogo() });
}
