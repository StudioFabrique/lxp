import { param, query } from "express-validator";
import { checkValidatorResult } from "../../../middleware/validators.ts";

export const getIndicatorsValidator = [
  param("userId").isMongoId().withMessage("Identifiant d'apprenant invalide"),
  query("from")
    .optional()
    .isISO8601()
    .withMessage("`from` doit être une date ISO 8601"),
  query("to")
    .optional()
    .isISO8601()
    .withMessage("`to` doit être une date ISO 8601"),
  checkValidatorResult,
];
