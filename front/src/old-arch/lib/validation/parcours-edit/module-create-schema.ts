import { z } from "zod";
import { regexGeneric, regexOptionalGeneric } from "../../../utils/constantes";

export const moduleMetadataCreateSchema = z.object({
  duration: z
    .number()
    .nullish()
    .transform((val) => val ?? 0),
});

export const moduleCreateSchema = moduleMetadataCreateSchema.extend({
  title: z
    .string({ required_error: "Un titre est requis pour le nouveau module" })
    .regex(regexGeneric, {
      message: "Le titre du module contient des caractères invalides",
    }),
  description: z
    .string()
    .regex(regexOptionalGeneric, {
      message: "La description du module contient des caractères invalides",
    })
    .nullish()
    .transform((val) => val ?? ""),
  quizInstructions: z
    .string()
    .regex(regexOptionalGeneric, {
      message:
        "Les instructions du professeur du module contiennent des caractères invalides",
    })
    .nullish()
    .transform((val) => val ?? ""),
});
