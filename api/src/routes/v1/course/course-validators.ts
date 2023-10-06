import { body, param, query } from "express-validator";

import { checkValidatorResult } from "../../../middleware/validators";
import {
  stringValidateGeneric,
  stringValidateOptional,
} from "../../../helpers/custom-validators";

export const courseIdValidator = [
  param("courseId")
    .notEmpty()
    .withMessage("L'identifiant du cours est toto")
    .isNumeric()
    .withMessage("L'identifiant du cours doit être un nombre")
    .trim()
    .escape(),
  checkValidatorResult,
];

export const postCourseValidator = [
  body("title")
    .notEmpty()
    .withMessage("Le titre du cours est requis")
    .isString()
    .withMessage("Le titre du cours n'est pas conforme"),
  body("moduleId")
    .notEmpty()
    .withMessage("L'identifiant du module est requis")
    .isNumeric()
    .withMessage("L'identifiant du module n'est pas conforme")
    .escape(),
  checkValidatorResult,
];

export const putCourseInformationsValidator = [
  body("id")
    .notEmpty()
    .withMessage("L'identifiant du cours est requis")
    .isNumeric()
    .withMessage("L'identifiant du cours doit être un nombre")
    .trim()
    .escape(),
  body("title")
    .notEmpty()
    .withMessage("Le titre du cours est requis")
    .custom(stringValidateGeneric)
    .withMessage("Le titre du cours n'est pas conforme"),
  body("description")
    .custom(stringValidateOptional)
    .withMessage("La description du cours n'est pas conforme"),
  checkValidatorResult,
  body("Visibility")
    .notEmpty()
    .withMessage("Une valeur est requise pour la visibilité du cours")
    .isBoolean()
    .withMessage("La visibilité du cours doit être une valeur booléenne"),
];

export const putCourseNewObjectiveValidator = [
  body("description")
    .notEmpty()
    .withMessage("Une description est requise pour l'objectif")
    .custom(stringValidateGeneric)
    .withMessage(
      "La description de l'objectif contient des caractères non autorisés"
    ),
  checkValidatorResult,
];
