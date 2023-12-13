import { z } from "zod";
import { regexGeneric, regexOptionalGeneric } from "../../../utils/constantes";

export const informationSchema = z.object({
  firstname: z
    .string({ required_error: "Le prénom est obligatoire" })
    .regex(regexGeneric, {
      message: "Le prénom contient des caractères invalides",
    }),
  lastname: z
    .string({ required_error: "Le nom est obligatoire" })
    .regex(regexOptionalGeneric, {
      message: "Le nom contient des caractères invalides",
    }),
});
