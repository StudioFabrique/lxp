import { body, param, query } from "express-validator";

import { checkValidatorResult } from "../../../middleware/validators";
import { stringValidateGeneric } from "../../../helpers/custom-validators";

export const postPromptValidator = [
  body("prompt")
    .notEmpty()
    .withMessage("Le prompt est requis")
    .isString()
    .withMessage("Le prompt doit être une chaîne de caractères")
    .trim(),
  body("fullPrompt")
    .notEmpty()
    .withMessage("Le prompt complet est requis")
    .isString()
    .withMessage("Le prompt complet doit être une chaîne de caractères")
    .trim(),
  // .custom(stringValidateGeneric),
  body("courseId")
    .optional()
    .isNumeric()
    .withMessage("Le courseId doit être un nombre"),
  checkValidatorResult,
];

export const postDialogsValidator = [
  body("lastDialogs")
    .isArray({ min: 2 })
    .withMessage("lastDialogs doit être un tableau avec au moins 2 éléments"),
  body("lastDialogs.*.origin")
    .isIn(["user", "bot"])
    .withMessage("L'origine doit être 'user' ou 'bot'"),
  body("lastDialogs.*.message")
    .isString()
    .withMessage("Le message doit être une chaîne de caractères")
    .trim()
    .custom(stringValidateGeneric),
  body("lastDialogs.*.date")
    .isISO8601()
    .withMessage("La date doit être au format ISO 8601"),
  checkValidatorResult,
];
