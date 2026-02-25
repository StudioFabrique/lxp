import { body, param, query } from "express-validator";
import {
  regexDate,
  regexGeneric,
  regexJwt,
  regexNumber,
  regexOptionalGeneric,
  regexPassword,
  regexRgba,
} from "../utils/constantes";
import { checkValidatorResult } from "../middleware/validators";
import { validateYoutubeUrl } from "./youtube-validator";

export function rgbaValidator(value: string) {
  return regexRgba.test(value);
}

export function stringValidateOptional(value: string) {
  return regexOptionalGeneric.test(value);
}

export function stringValidateGeneric(value: string) {
  return regexGeneric.test(value);
}

export function numberValidateGeneric(value: string) {
  return regexNumber.test(value);
}

export function passwordValidateGeneric(value: string) {
  return regexPassword.test(value);
}

export function dateValidateGeneric(value: string) {
  return regexDate.test(value);
}

export function tokenValidateGeneric(value: string) {
  return regexJwt.test(value);
}

export function videoUrlValidate(value: string) {
  if (!value) return true;

  // Si c'est un fichier local uploadé
  if (value.startsWith("video-")) {
    return /^video-[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}\d{17}traffic\.mp4$/.test(
      value,
    );
  }

  // Si c'est une URL YouTube
  return validateYoutubeUrl(value);
}

export const idsArrayValidator = [
  body().isArray().withMessage("Un tableau de nombres entiers est requis"),
  body("*")
    .isNumeric()
    .withMessage("Les identifiant doivent être des valeurs numériques"),
  checkValidatorResult,
];

export const virtualClassValidator = [
  body("virtualClass")
    .isURL()
    .withMessage("Url non valide")
    .notEmpty()
    .withMessage("Url absente"),
  checkValidatorResult,
];

export const isBoolean = (value: any) => {
  if (typeof value !== "boolean") {
    throw new Error("La valeur doit être un booléen");
  }
  return true;
};

export const paginationValidator = [
  param("stype")
    .isString()
    .withMessage(
      "La propriété pour le tri du tableau doit être une chaîne de caractères",
    )
    .custom(stringValidateGeneric)
    .withMessage(
      "La propriété pour le tri du tableau contient des caractères non autorisés.",
    ),
  param("sdir")
    .isString()
    .withMessage(
      "La direction pour le tri du tableau doit être une chaîne de caractères",
    )
    .custom((value) => {
      const availableSdir = ["asc", "desc"];
      return availableSdir.includes(value);
    })
    .withMessage(
      "La direction pour le tri du tableau contient des caractères non autorisés.",
    ),
  query("page")
    .isNumeric()
    .withMessage("Le numéro de la page doit être un nombre entier."),
  query("limit")
    .isNumeric()
    .withMessage(
      "Le nombre d'éléments affichés par page doit être un nombre entier.",
    ),
  query("searchTerm")
    .isString()
    .withMessage("Le terme de recherche doit être une chaîne de caractères.")
    .custom(stringValidateOptional)
    .withMessage("Le terme de recherche contient des caractères non autorisés.")
    .optional(),
];

export const updateVideoValidator = [
  body("data.url")
    .optional({ nullable: true })
    .isString()
    .withMessage("L'url fournie n'est pas une chaîne de caractères valide.")
    .custom(videoUrlValidate)
    .withMessage("L'url de la video contient des caractères non autorisés."),
  body("data.title")
    .notEmpty()
    .withMessage("Le titre de la video est obligatoire.")
    .isString()
    .withMessage("Le titre de la video doit être une chaîne de caractères.")
    .custom(stringValidateGeneric)
    .withMessage("Le titre de la video contient des caractères non autorisés."),
  body("data.description")
    .isString()
    .withMessage(
      "La description de la video doit être une chaîne de caractères.",
    )
    .custom(stringValidateOptional)
    .withMessage(
      "La description de la video contient des caractères non autorisés.",
    ),
  checkValidatorResult,
];
