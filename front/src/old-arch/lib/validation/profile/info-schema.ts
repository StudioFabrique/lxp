import { z } from "zod";
import {
  regexGeneric,
  regexMail,
  regexOptionalGeneric,
} from "../../../utils/constantes";

export const informationSchema = z.object({
  firstname: z
    .string({ required_error: "Le prénom est obligatoire" })
    .regex(regexGeneric, {
      message: "Le prénom contient des caractères invalides",
    }),
  lastname: z
    .string({ required_error: "Le nom est obligatoire" })
    .regex(regexGeneric, {
      message: "Le nom contient des caractères invalides",
    }),
  email: z
    .string({ required_error: "L'email est obligatoire" })
    .regex(regexMail, {
      message: "L'email contient des caractères invalides",
    }),
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
  city: z
    .string()
    .regex(regexOptionalGeneric, {
      message: "La ville contient des caractères invalides",
    })
    .optional(),
  postCode: z
    .string()
    .regex(regexOptionalGeneric, {
      message: "Le code postal contient des caractères invalides",
    })
    .optional(),
  phoneNumber: z
    .string()
    .regex(/* regexPhoneNumber */ regexOptionalGeneric, {
      message: "Le numéro de téléphone contient des caractères invalides",
    })
    .optional(),
  description: z
    .string()
    .regex(regexOptionalGeneric, {
      message: "La description contient des caractères invalides",
    })
    .optional(),
});
