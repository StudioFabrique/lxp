import { z } from "zod";
import { regexGeneric, regexOptionalGeneric } from "../../../src/config/constantes";

export const createGroupSchema = z.object({
  name: z
    .string({ required_error: "Le nom du groupe est obligatoire" })
    .regex(regexGeneric, {
      message: "Le nom du groupe contient des caractères invalides",
    }),
  desc: z
    .string()
    .regex(regexOptionalGeneric, {
      message: "La description contient des caractères invalides",
    })
    .optional(),
});
