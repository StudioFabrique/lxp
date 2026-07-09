import { z } from "zod";
import { regexGeneric, regexOptionalGeneric } from "../../constantes";

export const activiteMetaDataSchema = z.object({
  title: z
    .string({ error: "Un titre est requis pour le nouveau module" })
    .regex(regexGeneric, {
      message: "Le titre de la video contient des caractères invalides",
    }),
  description: z
    .string()
    .regex(regexOptionalGeneric, {
      message: "La description de la video contient des caractères invalides",
    })
    .optional(),
  url: z.string().optional(),
});
