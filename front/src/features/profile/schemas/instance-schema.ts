import { z } from "zod";
import { optionalWebUrl } from "../../../utils/validation/fields";
import { lightThemes, darkThemes } from "../../../config/themes";
export const instanceIdentitySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom de l’organisme doit contenir au moins 2 caractères.")
    .max(80),
  website: z.string().trim().pipe(optionalWebUrl),
  color: z.string().regex(/^#[0-9a-f]{6}$/i),
});
export const instanceThemesSchema = z.object({
  enabledThemes: z
    .array(z.string())
    .refine(
      (values) =>
        values.every((value) =>
          [...lightThemes, ...darkThemes].some((theme) => theme === value),
        ) &&
        lightThemes.some((theme) => values.includes(theme)) &&
        darkThemes.some((theme) => values.includes(theme)),
      "Conservez au moins un thème dans chaque mode.",
    ),
});
export const instanceEmailSchema = z.object({
  emailTemplate: z.enum([
    "minimal",
    "gradient",
    "editorial",
    "soft",
    "contrast",
    "compact",
  ]),
});
