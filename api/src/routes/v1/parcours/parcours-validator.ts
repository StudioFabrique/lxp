import { body, param } from "express-validator";

import { checkValidatorResult } from "../../../middleware/validators";

export const postParcoursValidator = [
  body("formation")
    .isNumeric()
    .withMessage("Identifiant de formation non valide")
    .notEmpty()
    .withMessage("Identifiant de formation absent")
    .escape(),
  body("title")
    .isString()
    .withMessage("Titre de parcours non valide")
    .notEmpty()
    .withMessage("Le titre du parcours doit avoir au moins 1 caractère")
    .trim()
    .escape(),
  checkValidatorResult,
];

export const parcoursByIdValidator = [
  param("parcoursId")
    .isNumeric()
    .withMessage("Identifiant de parcours invalide")
    .notEmpty()
    .withMessage("Identifiant de parcours absent")
    .escape(),
  checkValidatorResult,
];

export const getParcoursByFormationValidator = [
  param("formationId")
    .isNumeric()
    .withMessage("Identifiant de formation invalide")
    .notEmpty()
    .withMessage("Identifiant de formation absent")
    .escape(),
  checkValidatorResult,
];
