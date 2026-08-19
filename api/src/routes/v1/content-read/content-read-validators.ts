import { param } from "express-validator";
import { CONTENT_TYPES } from "../../../config/content-read.ts";
import { checkValidatorResult } from "../../../middleware/validators.ts";

export const contentReadValidator = [
  param("type")
    .isIn(CONTENT_TYPES)
    .withMessage(`Le type de contenu doit être l'un de : ${CONTENT_TYPES.join(", ")}`),
  param("id").isInt({ min: 1 }).withMessage("Identifiant de contenu invalide"),
  checkValidatorResult,
];
