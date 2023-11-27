import { body, param } from "express-validator";
import { checkValidatorResult } from "../../../middleware/validators";
import { dateValidateGeneric } from "../../../helpers/custom-validators";

export const moduleIdValidator = [
  param("moduleId")
    .notEmpty()
    .withMessage("L'identifiant du module est requis")
    .isNumeric()
    .withMessage("L'identifiant du module n'est pas un nombre entier"),
  checkValidatorResult,
];

export const moduleIdFromBodyValidator = [
  body("moduleId")
    .isNumeric()
    .withMessage("Identifiant de module non valide")
    .notEmpty()
    .withMessage("Un identifiant de module est requise")
    .trim()
    .escape(),
  checkValidatorResult,
];

export const getModulesFromParcoursValidator = [
  param("parcoursId")
    .isNumeric()
    .withMessage("Identifiant de parcours non valide")
    .notEmpty()
    .withMessage("Un identifiant de parcours est requis")
    .trim()
    .escape(),
  checkValidatorResult,
];

export const getModuleFormationValidator = [
  param("formationId")
    .trim()
    .notEmpty()
    .withMessage("L'identifiant de la formation est requis")
    .isNumeric()
    .withMessage("L'identifiant de la formation doit être un nombre entier")
    .escape(),
  checkValidatorResult,
];

export const updateDatesModules = [
  body("minDate")
    .trim()
    .notEmpty()
    .withMessage("Une date de début est requise")
    .custom(dateValidateGeneric)
    .withMessage("La date de début du module contient des caractères invalides")
    .escape(),
  body("dateMax")
    .trim()
    .notEmpty()
    .withMessage("Une date de fin est requise")
    .custom(dateValidateGeneric)
    .withMessage("La date de fin du module contient des caractères invalides")
    .escape(),
  checkValidatorResult,
];

export const updateDurationValidator = [
  body("id")
    .isNumeric()
    .withMessage("Identifiant de module non valide")
    .notEmpty()
    .withMessage("Un identifiant de module est requis")
    .trim()
    .escape(),
  body("duration")
    .trim()
    .notEmpty()
    .withMessage("La durée du module est requise")
    .isNumeric()
    .withMessage("La durée du module doit être un nombre d'heures entier")
    .escape(),
  checkValidatorResult,
];
