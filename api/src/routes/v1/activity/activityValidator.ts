import { body, param } from "express-validator";
import { checkValidatorResult } from "../../../middleware/validators";
import { stringValidateGeneric } from "../../../helpers/custom-validators";

export const activityIdValidator = [
  param("activityId")
    .notEmpty()
    .withMessage("L'idientifiant de l'activité est requis.")
    .isNumeric()
    .isInt()
    .withMessage("L'identifiant de l'activité doit être un nombre entier."),
  checkValidatorResult,
];

export const updateActivityValidator = [
  body("url")
    .notEmpty()
    .withMessage("L'url de l'activité est requise.")
    .isURL()
    .withMessage("Format d'url non valide."),
  body("order")
    .notEmpty()
    .withMessage("La propriété order est requise.")
    .isNumeric()
    .isInt()
    .withMessage("La propriété order doit être un nombre entier."),
  checkValidatorResult,
];

export const updateVideoValidator = [
  body("url")
    .notEmpty()
    .withMessage("L'url de l'activité video est requise.")
    .isURL()
    .withMessage("L'url fournie n'est pas une url valide."),
  checkValidatorResult,
];

export const postVideoValidator = [
  body("data.type")
    .notEmpty()
    .withMessage("Le type de l'activité est requis.")
    .isString()
    .withMessage("Le type de l'activité doit être une chaîne de caractères.")
    .custom(stringValidateGeneric)
    .withMessage("Le type de l'activité contient des caractères invalides."),
  body("data.order")
    .notEmpty()
    .withMessage("La propriété order est requise.")
    .isNumeric()
    .isInt()
    .withMessage("La propriété order doit être un nombre entier."),
  checkValidatorResult,
];
