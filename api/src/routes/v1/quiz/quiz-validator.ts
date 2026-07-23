import { body, param, query } from "express-validator";
import { checkValidatorResult } from "../../../middleware/validators";

/**
 * GET /quiz/course/ending/stream/:courseId
 * - courseId : identifiant entier positif du cours
 */
export const endingCourseQuizStreamValidator = [
  param("courseId")
    .notEmpty()
    .withMessage("L'identifiant du cours est requis.")
    .isInt({ min: 1 })
    .withMessage("L'identifiant du cours doit être un entier positif."),
  checkValidatorResult,
];

/**
 * POST /quiz/random
 * - content : texte brut de l'activité (sans balises HTML)
 *
 * Note : stringValidateGeneric n'est pas utilisé ici car le contenu pédagogique
 * est du texte libre Unicode envoyé directement à l'API IA (pas de stockage SQL
 * ni rendu HTML — un whitelist de caractères serait trop restrictif).
 */
export const randomQuizValidator = [
  body("content")
    .notEmpty()
    .withMessage("Le contenu de l'activité est requis.")
    .isString()
    .withMessage("Le contenu doit être une chaîne de caractères.")
    .isLength({ max: 50_000 })
    .withMessage("Le contenu ne peut pas dépasser 50 000 caractères.")
    .trim(),
  checkValidatorResult,
];

/**
 * POST /quiz/preliminary/stream?n=<nb>
 * - n (query, optionnel) : nombre de questions souhaité, entier entre 1 et 20
 * - moduleId : identifiant stable du module
 *
 * Note : même raison que ci-dessus — ces champs sont du texte pédagogique libre
 * (accents, ponctuation variée, etc.) destiné uniquement à l'API IA.
 */
export const preliminaryQuizStreamValidator = [
  query("n")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Le nombre de questions doit être un entier entre 1 et 20."),
  body("moduleId")
    .notEmpty()
    .withMessage("L'identifiant du module est requis.")
    .isInt({ min: 1 })
    .withMessage("L'identifiant du module doit être un entier positif."),
  checkValidatorResult,
];

/**
 * POST /quiz/question/report
 * - externalId    : identifiant unique de la question (chaîne de caractères)
 * - comment        : texte expliquant l'erreur
 */
export const reportQuizQuestionValidator = [
  body("externalId")
    .notEmpty()
    .withMessage("L'identifiant de la question est requis.")
    .isString()
    .withMessage(
      "L'identifiant de la question doit être une chaîne de caractères.",
    ),
  body("comment")
    .notEmpty()
    .withMessage("Le commentaire est requis.")
    .isString()
    .withMessage("Le commentaire doit être une chaîne de caractères.")
    .isLength({ max: 2000 })
    .withMessage("Le commentaire ne peut pas dépasser 2000 caractères.")
    .trim(),
  checkValidatorResult,
];
