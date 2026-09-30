import { z } from "zod";
import { passwordField } from "../../../utils/validation/fields";

export const passwordSchema = z.object({
  oldPass: z.string().min(1, "L'ancien mot de passe est requis"),
  newPass: passwordField, confirmNewPass: z.string().min(1, "La confirmation est requise"),
}).refine((value) => value.newPass === value.confirmNewPass, {
  message: "Les mots de passe ne correspondent pas.", path: ["confirmNewPass"],
});
