import { body, param, query } from "express-validator";

import { checkValidatorResult } from "../../../middleware/validators";
import {
  descriptionValidateOptional,
  titleValidate,
} from "../../../helpers/custom-validators";

export const courseIdValidator = [
  param("courseId")
    .notEmpty()
    .withMessage("L'identifiant du cours est requis")
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
    .custom(titleValidate)
    .withMessage("Le titre du cours n'est pas conforme"),
  body("description")
    .custom(descriptionValidateOptional)
    .withMessage("La description du cours n'est pas conforme"),
  checkValidatorResult,
];

export const putCourseVisibilityValidator = [
  query("visibility")
    .notEmpty()
    .withMessage("Une valeur est requise pour la visibilité du cours")
    .trim()
    .escape()
    .isBoolean()
    .withMessage("Une valeur booleene est requise"),
  checkValidatorResult,
];
