import { z } from "zod";
import { regexGeneric } from "../../utils/constantes";

export const createGroupSchema = z.object({
  name: z
    .string({ required_error: "Le nom du groupe est obligatoire" })
    .min(3, {
      message: "Le nom du groupe doit comporter au moins trois caractères",
    })
    .regex(regexGeneric, {
      message: "Le nom du groupe contient des caractères invalides",
    }),
  desc: z
    .string({ required_error: "La description du groupe est obligatoire" })
    .min(5, {
      message: "La description du groupe doit avoir au moins trois caractères",
    })
    .regex(regexGeneric, {
      message: "La description du groupe contient des caractères invalides",
    }),
});
