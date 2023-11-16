import { z } from "zod";
import {
  regexGeneric,
  regexNumber,
  regexOptionalGeneric,
} from "../../../utils/constantes";

export const moduleUpdateSchema = z.object({
  title: z
    .string({ required_error: "Un titre est requis pour le nouveau module" })
    .min(3, {
      message: "Le titre du module doit avoir au moins trois caractères",
    })
    .regex(regexGeneric, {
      message: "Le titre du module contient des caractères invalides",
    }),
  description: z
    .string()
    .regex(regexOptionalGeneric, {
      message: "La description du module contient des caractères invalides",
    })
    .optional(),
  duration: z
    .string({ required_error: "Une durée en heure est obligatoire" })
    .regex(regexNumber, {
      message: "La durée du parcours doit être un nombre entier",
    }),
});
