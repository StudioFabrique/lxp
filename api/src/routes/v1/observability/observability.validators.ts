import { param, query, type ValidationChain } from "express-validator";
import { checkValidatorResult } from "../../../middleware/validators.ts";
import {
  ACTIVITY_PERIODS,
  DETAIL_KINDS,
  MAX_CUSTOM_RANGE_DAYS,
} from "../../../utils/services/observability/victorialogs-queries.ts";

const DAY_MS = 24 * 60 * 60 * 1000;
/** Instant ISO complet en UTC, tel que produit par `Date.toISOString()` côté navigateur. */
const INSTANT_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;

const parseInstant = (value: unknown): Date | null => {
  if (typeof value !== "string" || !INSTANT_PATTERN.test(value)) return null;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date : null;
};

/**
 * Fenêtre d'analyse : soit `period` (liste blanche), soit `from` et `to`
 * ensemble (intervalle `[from, to[`). Les deux modes sont exclusifs.
 */
const rangeValidators: ValidationChain[] = [
  query("period")
    .optional()
    .isString()
    .bail()
    .isIn([...ACTIVITY_PERIODS])
    .withMessage("La période est invalide."),
  query("from")
    .optional()
    .custom((from, { req }) => {
      const to = parseInstant(req.query?.to);
      const start = parseInstant(from);
      if (!start || !to) throw new Error("Les dates de l'intervalle sont invalides.");
      if (req.query?.period !== undefined) {
        throw new Error("Une période et un intervalle ne se combinent pas.");
      }
      const now = Date.now();
      if (start >= to) throw new Error("La date de début doit précéder la date de fin.");
      if (to.getTime() - start.getTime() > MAX_CUSTOM_RANGE_DAYS * DAY_MS) {
        throw new Error("L'intervalle est trop long.");
      }
      // La fin d'un intervalle « jusqu'à aujourd'hui » tombe demain à minuit local.
      if (to.getTime() > now + 2 * DAY_MS || start.getTime() < now - 400 * DAY_MS) {
        throw new Error("L'intervalle est hors limites.");
      }
      return true;
    }),
  query("to")
    .optional()
    .custom((to, { req }) => {
      if (!parseInstant(to)) throw new Error("Les dates de l'intervalle sont invalides.");
      if (req.query?.from === undefined) throw new Error("La date de début est requise.");
      return true;
    }),
];

export const overviewValidator = [...rangeValidators, checkValidatorResult];

export const userActivityValidator = [
  param("userId")
    .isMongoId()
    .withMessage("L'identifiant de l'utilisateur est invalide."),
  ...rangeValidators,
  checkValidatorResult,
];

export const detailsValidator = [
  param("kind")
    .isIn([...DETAIL_KINDS])
    .withMessage("Le type de détail est invalide."),
  ...rangeValidators,
  checkValidatorResult,
];
