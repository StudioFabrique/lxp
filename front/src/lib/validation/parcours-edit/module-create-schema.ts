import { z } from "zod";
import { regexGeneric, regexOptionalGeneric } from "../../../utils/constantes";

export const moduleCreateSchema = z.object({
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
    .optional(),
});
