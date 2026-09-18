import type { Response } from "express";
import type CustomRequest from "../utils/interfaces/express/custom-request.ts";
import fs from "fs";
import path from "path";
import {
  hasCompanyLogo,
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
]);

export async function httpGetInstanceSettings(
  _req: CustomRequest,
  res: Response,
) {
  const [settings, hasLogo] = await Promise.all([
    readInstanceSettings(),
    hasCompanyLogo(),
  ]);
  res.json({ ...settings, hasLogo });
}

export async function httpPutInstanceSettings(
  req: CustomRequest,
  res: Response,
) {
  const { name, defaultTheme } = req.body ?? {};
  const currentSettings = await readInstanceSettings();
  let titles: Record<string, unknown> | undefined;
  let messages: Record<string, unknown> | undefined;

  try {
    titles = JSON.parse(req.body?.welcomeTitles ?? "");
    messages = JSON.parse(req.body?.welcomeMessages ?? "");
  } catch {
    return res.status(400).json({ message: "Les messages envoyés sont invalides." });
  }
  const titleValues = [titles?.admin, titles?.teacher, titles?.student];
  const messageValues = [messages?.admin, messages?.teacher, messages?.student];

  if (
    typeof name !== "string" ||
    name.trim().length < 2 ||
    name.trim().length > 80 ||
    typeof defaultTheme !== "string" ||
    !allowedThemes.has(defaultTheme) ||
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
        "Le nom et les messages de bienvenue ne respectent pas les longueurs autorisées.",
    });
  }

  const settings = {
    name: name.trim(),
    setupCompleted:
      req.body?.setupCompleted === "true"
        ? true
        : currentSettings.setupCompleted,
    defaultTheme,
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
    const logoPath = path.join(
      import.meta.dirname,
      "..",
      "..",
      "uploads",
      "company",
      "company-logo.jpeg",
    );
    await fs.promises.rm(logoPath, { force: true });
  }

  res.json({ ...settings, hasLogo: await hasCompanyLogo() });
}
