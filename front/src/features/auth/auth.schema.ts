import { z } from "zod";
import {
  emailField,
  passwordField,
  requiredText,
  tokenField,
} from "../../utils/validation/fields";

const passwordValues = z.object({
  password: passwordField,
  confirmPassword: z
    .string()
    .min(1, "La confirmation du mot de passe est requise."),
});
const matchingPasswords = (value: {
  password: string;
  confirmPassword: string;
}) => value.password === value.confirmPassword;
const confirmationError = {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
};
export const passwordCreationSchema = passwordValues.refine(
  matchingPasswords,
  confirmationError,
);
export const adminCreationSchema = passwordValues
  .extend({
    email: emailField,
    firstname: requiredText("Le prénom est requis."),
    lastname: requiredText("Le nom est requis."),
  })
  .refine(matchingPasswords, confirmationError);
export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Le mot de passe est requis."),
});
export const activationTokenSchema = z.object({ token: tokenField });
export const recoverySchema = z.object({ email: emailField });
