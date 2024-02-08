import { z } from "zod";
import { regexGeneric } from "../../utils/constantes";

export const postFormationSchema = z.object({
  title: z
    .string({ required_error: "Un titre est requis pour la formation." })
    .regex(regexGeneric, {
      message:
        "Le titre de la formation contient des caractères non autorisés.",
    }),
  description: z
    .string({
      required_error: "Une description est requise pour la formation.",
    })
    .regex(regexGeneric, {
      message:
        "La description de la formation contient des caractères non autorisés.",
    }),
  level: z
    .string({ required_error: "Le niveau de la formation est requis." })
    .regex(regexGeneric, {
      message:
        "Le niveau de la formation contient des caractères non autorisés.",
    }),
  code: z
    .string({ required_error: "Le code RHCP de la formation est requis." })
    .regex(regexGeneric, {
      message: "Le code RHCP de la formaton est requis.",
    }),
});
