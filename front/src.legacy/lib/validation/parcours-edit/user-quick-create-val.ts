import { z } from "zod";
import { regexGeneric, regexOptionalGeneric } from "../../../../src/config/constantes";

export const userQuickCreateSchema = z.object({
  lastname: z
    .string({ required_error: "Le nom est obligatoire" })
    .regex(regexGeneric, {
      message: "Le nom contient des caractères invalides",
    }),
  firstname: z
    .string({ required_error: "Le prénom est obligatoire" })
    .regex(regexGeneric, {
      message: "Le prénom contient des caractères invalides",
    }),
  email: z
    .string({ required_error: "L'adresse email est obligatoire" })
    .email({ message: "Adresse email invalide." }),
  nickname: z
    .string()
    .regex(regexOptionalGeneric, {
      message: "Le pseudo contient des caractères invalides",
    })
    .optional(),
  address: z
    .string()
    .regex(regexOptionalGeneric, {
      message: "L'adresse contient des caractères invalides",
    })
    .optional(),
  postCode: z
    .string()
    .regex(regexOptionalGeneric, {
      message: "Le code postal contient des caractères invalides",
    })
    .optional(),
  city: z
    .string()
    .regex(regexOptionalGeneric, {
      message: "La ville contient des caractères invalides",
    })
    .optional(),
  phoneNumber: z
    .string({ required_error: "Le numéro de téléphone est obligatoire" })
    .regex(regexOptionalGeneric, {
      message: "Le numéro de téléphone contient des caractères invalides",
    })
    .optional(),
});
