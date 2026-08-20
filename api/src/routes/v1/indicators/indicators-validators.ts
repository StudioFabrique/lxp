import { param, query } from "express-validator";
import { checkValidatorResult } from "../../../middleware/validators.ts";

/**
 * Identifiant d'apprenant et fenêtre de calcul : la même pour la lecture des
 * indicateurs et pour la prédiction, qui portent sur la même période.
 */
export const indicatorsWindowValidator = [
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
