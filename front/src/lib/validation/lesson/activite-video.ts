import { z } from "zod";
import { regexGeneric, regexOptionalGeneric } from "../../../utils/constantes";

export const activiteVideo = z.object({
  title: z
    .string({ required_error: "Un titre est requis pour le nouveau module" })
    .regex(regexGeneric, {
      message: "Le titre de la video contient des caractères invalides",
    }),
  description: z
    .string()
    .regex(regexOptionalGeneric, {
      message: "La description de la video contient des caractères invalides",
    })
    .optional(),
});
