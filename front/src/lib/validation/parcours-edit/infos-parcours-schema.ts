import { z } from "zod";
import { regexGeneric, regexOptionalGeneric } from "../../../utils/constantes";

export const infosParCoursSchema = z.object({
  title: z
    .string({ required_error: "Le titre du parcours est obligatoire" })
    .regex(regexGeneric, {
      message: "Le titre du cours contient des caractères invalides",
    }),
  description: z
    .string()
    .regex(regexOptionalGeneric, {
      message: "La description du parcours contient des caractères invalides",
    })
    .optional(),
});
