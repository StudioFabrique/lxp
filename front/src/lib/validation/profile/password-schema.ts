import { z } from "zod";
import { regexPassword } from "../../../utils/constantes";

export const passwordSchema = z.object({
  oldPass: z
    .string({ required_error: "L'ancien mot de passe est requis" })
    .regex(regexPassword, {
      message:
        "L'ancien mot de passe est incorrecte. Veuillez contacter l'administrateur si l'erreur persiste.",
    }),
  newPass: z
    .string({ required_error: "Le nouveau mot de passe est requis" })
    .regex(regexPassword, {
      message: "Le nouveau mot de passe n'est pas valide",
    }),
  confirmNewPass: z
    .string({ required_error: "La vérification du mot de passe est requis" })
    .regex(regexPassword, {
      message: "La vérification du mot de passe n'est pas valide",
    }),
});
