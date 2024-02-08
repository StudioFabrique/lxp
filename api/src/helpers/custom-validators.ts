import { body, param, query } from "express-validator";
import {
  regexDate,
  regexGeneric,
  regexNumber,
  regexOptionalGeneric,
  regexPassword,
  regexRgba,
  regexVideoUrl,
} from "../utils/constantes";
import { checkValidatorResult } from "../middleware/validators";

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

export function videoUrlValidate(value: string) {
  return regexVideoUrl.test(value);
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

export const paginationValidator = [
  param("stype")
    .notEmpty()
    .withMessage("La propriété pour le tri de la liste est requise.")
    .isString()
    .withMessage(
      "La propriété pour le tri du tableau doit être une chaîne de caractères"
    )
    .custom(stringValidateGeneric)
    .withMessage(
      "La propriété pour le tri du tableau contient des caractères non autorisés."
    ),
  param("sdir")
    .notEmpty()
    .withMessage("La direction pour le tri de la liste est requise.")
    .isString()
    .withMessage(
      "La direction pour le tri du tableau doit être une chaîne de caractères"
    )
    .custom(stringValidateGeneric)
    .withMessage(
      "La direction pour le tri du tableau contient des caractères non autorisés."
    ),
  query("page")
    .notEmpty()
    .withMessage("Le numéro de la page est reqyus.")
    .isNumeric()
    .withMessage("Le numéro de la page doit être un nombre entier."),
  query("limit")
    .notEmpty()
    .withMessage("Le nombre d'éléments affichés par page est requis.")
    .isNumeric()
    .withMessage(
      "Le nombre d'éléments affichés par page doit être un nombre entier."
    ),
  checkValidatorResult,
];
