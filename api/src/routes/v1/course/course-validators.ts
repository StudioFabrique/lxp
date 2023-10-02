import { body, param } from "express-validator";

import { checkValidatorResult } from "../../../middleware/validators";

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

export const getCourseInformationsValidator = [
  param("courseId")
    .notEmpty()
    .withMessage("L'identifiant du cours est requis")
    .isNumeric()
    .withMessage("L'identifiant du cours doit être un nombre")
    .trim()
    .escape(),
  checkValidatorResult,
];
