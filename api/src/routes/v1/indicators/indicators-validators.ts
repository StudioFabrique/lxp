import { body, param, query } from "express-validator";
import { FEEDBACK_VERDICTS, OBSERVED_OUTCOMES } from "../../../config/indicator-analysis.ts";
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

export const analysisHistoryValidator = [
  param("userId").isMongoId(),
  query("before").optional().isMongoId(),
  checkValidatorResult,
];

export const analysisFeedbackValidator = [
  param("userId").isMongoId(),
  param("analysisId").isMongoId(),
  body("verdict").isIn(FEEDBACK_VERDICTS),
  body("comment").optional().isString().bail().trim().isLength({ max: 2000 }),
  body("actionTaken").optional().isString().bail().trim().isLength({ max: 2000 }),
  body("observedOutcome").optional().isIn(OBSERVED_OUTCOMES),
  checkValidatorResult,
];
