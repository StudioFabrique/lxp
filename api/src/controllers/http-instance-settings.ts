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

  const settings = {
    name: name.trim(),
    setupCompleted:
      req.body?.setupCompleted === "true"
        ? true
        : currentSettings.setupCompleted,
    enabledThemes: [...new Set(enabledThemes as string[])],
  };

  await writeInstanceSettings(settings);

  if (req.body?.deleteLogo === "true" && !req.file) {
    await fs.promises.rm(instanceLogoPath, { force: true });
  }

  res.json({ ...settings, hasLogo: await hasInstanceLogo() });
}
