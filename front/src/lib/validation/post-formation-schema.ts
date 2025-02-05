import { z } from "zod";
import { regexGeneric, regexOptionalGeneric } from "../../utils/constantes";

export const postFormationSchema = z.object({
  title: z
    .string({ required_error: "Un titre est requis pour la formation." })
    .regex(regexGeneric, {
      message:
        "Le titre de la formation contient des caractères non autorisés.",
    }),
  description: z
    .string()
    .regex(regexOptionalGeneric, {
      message:
        "La description de la formation contient des caractères non autorisés.",
    })
    .nullable()
    .optional(),
  level: z
    .string({ required_error: "Le niveau de la formation est requis." })
    .regex(regexGeneric, {
      message:
        "Le niveau de la formation contient des caractères non autorisés.",
    }),
  code: z
    .string()
    .regex(regexOptionalGeneric, {
      message: "Le code RNCP contient des caractères non autorisés.",
    })
    .nullable()
    .optional(),
});
