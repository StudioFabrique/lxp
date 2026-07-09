import { z } from "zod";
import { regexGeneric, regexOptionalGeneric } from "../../config/constantes";

export const infosParCoursSchema = z.object({
  title: z
    .string({ error: "Le titre du parcours est obligatoire" })
    .min(1, "Le titre du parcours est obligatoire"),
  description: z.string().optional(),
});

export const moduleCreateSchema = z.object({
  moduleId: z.number().optional(),
  title: z
    .string({ error: "Un titre est requis pour le nouveau module" })
    .min(1, "Le titre du module est obligatoire")
    .regex(regexGeneric, {
      message: "Le titre du module contient des caractères invalides",
    }),
  description: z
    .string()
    .regex(regexOptionalGeneric, {
      message: "La description du module contient des caractères invalides",
    })
    .optional()
    .default(""),
  duration: z.number().optional().default(0),
  quizInstructions: z
    .string()
    .regex(regexOptionalGeneric, {
      message:
        "Les instructions du professeur du module contiennent des caractères invalides",
    })
    .optional()
    .default(""),
});
