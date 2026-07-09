import { z } from "zod";
import { regexPassword } from "../../../config/constantes";

export const passwordSchema = z.object({
  oldPass: z
    .string({ error: "L'ancien mot de passe est requis" })
    .regex(regexPassword, {
      message:
        "L'ancien mot de passe est incorrecte. Veuillez contacter l'administrateur si l'erreur persiste.",
    }),
  newPass: z
    .string({ error: "Le nouveau mot de passe est requis" })
    .regex(regexPassword, {
      message: "Le nouveau mot de passe n'est pas valide",
    }),
  confirmNewPass: z
    .string({ error: "La vérification du mot de passe est requis" })
    .regex(regexPassword, {
      message: "La vérification du mot de passe n'est pas valide",
    }),
});
