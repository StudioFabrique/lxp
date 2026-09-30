import { z } from "zod";
import { regexGeneric, regexOptionalGeneric, regexPassword } from "../../config/constantes";

export const requiredText = (message = "Ce champ est obligatoire.") =>
  z.string().trim().min(1, message).regex(regexGeneric, "Ce champ contient des caractères invalides.");
export const optionalText = z.string().trim().regex(regexOptionalGeneric, "Ce champ contient des caractères invalides.");
export const emailField = z.string().trim().min(1, "L'adresse email est obligatoire.").email("Adresse email invalide.");
export const passwordField = z.string().min(1, "Le mot de passe est requis.").regex(regexPassword,
  "Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.");
export const tokenField = requiredText("La clé d'activation est requise.");
export const webUrl = z.string().trim().url("Adresse web invalide.").refine(
  (value) => /^https?:\/\//i.test(value), "Utilisez une adresse commençant par http:// ou https://.");
export const optionalWebUrl = z.union([z.literal(""), webUrl]);
export const postCodeField = z.string().trim().regex(/^[0-9]*$/, "Le code postal doit contenir uniquement des chiffres.");
export const phoneField = z.string().trim().regex(/^(?:\+?[0-9][0-9 ().-]*)?$/, "Le numéro de téléphone n'est pas valide.");
export const tagSchema = z.object({ id: z.number(), name: requiredText("Le nom du tag est obligatoire."), color: z.string() });
export const hobbySchema = z.object({ _id: z.string().optional(), title: requiredText("Saisissez une passion.") });
export const linkSchema = z.object({ _id: z.string().optional(), url: webUrl,
  type: z.enum(["website", "twitter", "facebook", "youtube", "instagram", "linkedin"]), alias: z.string().nullable().optional() });
