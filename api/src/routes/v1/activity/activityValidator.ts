import { body, param } from "express-validator";
import { checkValidatorResult } from "../../../middleware/validators.ts";
import {
  stringValidateGeneric,
  stringValidateOptional,
  videoUrlValidate,
} from "../../../helpers/custom-validators.ts";

export const idValidator = [
  param("id")
    .notEmpty()
    .withMessage("L'idientifiant de l'activité est requis.")
    .isNumeric()
    .isInt()
    .withMessage("L'identifiant de l'activité doit être un nombre entier."),
  checkValidatorResult,
];

export const activityIdValidator = [
  param("activityId")
    .notEmpty()
    .withMessage("L'idientifiant de l'activité est requis.")
    .isNumeric()
    .isInt()
    .withMessage("L'identifiant de l'activité doit être un nombre entier."),
  checkValidatorResult,
];

export const resourceIdValidator = [
  param("resourceId")
    .notEmpty()
    .withMessage("L'idientifiant de la ressource est requis.")
    .isNumeric()
    .isInt()
    .withMessage("L'identifiant de la ressource doit être un nombre entier."),
  checkValidatorResult,
];

export const updateActivityValidator = [
  body("title")
    .custom(stringValidateGeneric)
    .withMessage("Le titre de la video contient des caractères non autorisés."),
  checkValidatorResult,
];

export const updateActivityTitleValidator = [
  param("parent")
    .isIn(["lesson", "resource"])
    .withMessage('Le parent doit être soit "lesson" soit "resource".'),
  body("title")
    .notEmpty()
    .withMessage("Le titre de l'activité est obligatoire.")
    .isString()
    .withMessage("Le titre de l'activité doit être une chaîne de caractères.")
    .custom(stringValidateGeneric)
    .withMessage(
      "Le titre de l'activité contient des caractères non autorisés.",
    ),
  checkValidatorResult,
];

export const updateVideoValidator = [
  body("data.url")
    .optional({ nullable: true })
    .isString()
    .withMessage("L'url fournie n'est pas une chaîne de caractères valide.")
    .custom(videoUrlValidate)
    .withMessage("L'url de la video contient des caractères non autorisés."),
  body("data.title")
    .notEmpty()
    .withMessage("Le titre de la video est obligatoire.")
    .isString()
    .withMessage("Le titre de la video doit être une chaîne de caractères.")
    .custom(stringValidateGeneric)
    .withMessage("Le titre de la video contient des caractères non autorisés."),
  checkValidatorResult,
];

export const postVideoValidator = [
  body("data.title")
    .notEmpty()
    .withMessage("Le titre de la video est obligatoire.")
    .isString()
    .withMessage("Le titre de la video doit être une chaîne de caractères.")
    .custom(stringValidateGeneric)
    .withMessage("Le titre de la video contient des caractères non autorisés."),
  body("data.url")
    .optional({ nullable: true })
    .isString()
    .withMessage("L'url fournie n'est pas une chaîne de caractères valide.")
    .custom(videoUrlValidate)
    .withMessage("L'url de la video contient des caractères non autorisés."),
];

export const postIframeValidator = [
  body("title")
    .notEmpty()
    .withMessage("Le titre de l'activité est obligatoire.")
    .isString()
    .withMessage("Le titre de l'activité doit être une chaîne de caractères.")
    .custom(stringValidateGeneric)
    .withMessage(
      "Le titre de l'activité contient des caractères non autorisés.",
    ),
  body("url")
    .isString()
    .withMessage("L'url fournie n'est pas une chaîne de caractères valide.")
    .isURL()
    .withMessage("L'url de l'activité contient des caractères non autorisés."),
  body("parent")
    .optional()
    .isIn(["lesson", "resource"])
    .withMessage('Le champ "parent" doit être soit "lesson" soit "resource".'),
  checkValidatorResult,
];

export const updateIframeValidator = [
  body("title")
    .notEmpty()
    .withMessage("Le titre de l'activité est obligatoire.")
    .isString()
    .withMessage("Le titre de l'activité doit être une chaîne de caractères.")
    .custom(stringValidateGeneric)
    .withMessage(
      "Le titre de l'activité contient des caractères non autorisés.",
    ),
  body("url")
    .isString()
    .withMessage("L'url fournie n'est pas une chaîne de caractères valide.")
    .isURL()
    .withMessage("L'url de l'activité contient des caractères non autorisés."),
  body("parent")
    .optional()
    .isIn(["lesson", "resource"])
    .withMessage('Le champ "parent" doit être soit "lesson" soit "resource".'),
  checkValidatorResult,
];

export const putReorderActivitiesValidator = [
  body("activitiesIds")
    .isArray()
    .notEmpty()
    .withMessage("La leçon requiert un tableau d'identifiants.")
    .notEmpty(),
  body("activitiesIds.*")
    .notEmpty()
    .withMessage(
      "Le tableau d'identifiants doit contenir une ou plusieurs valeurs.",
    )
    .isNumeric()
    .withMessage(
      "Le tableau d'identifiants doit contenir des nombres entiers uniquement.",
    ),
  body("parent")
    .optional()
    .isIn(["lesson", "resource"])
    .withMessage('Le champ "parent" doit être soit "lesson" soit "resource".'),
  checkValidatorResult,
];

export const putResourceValidator = [
  body("label")
    .custom(stringValidateGeneric)
    .withMessage(
      "Le label de la ressource contient des caractères non autorisés.",
    ),
  checkValidatorResult,
];

export const postImage = [
  param("lessonId")
    .isNumeric()
    .withMessage("L'identifiant de la leçon doit être un nombre entier."),
  checkValidatorResult,
];

export const postImageValidator = [
  param("lessonId")
    .isNumeric()
    .withMessage("L'identifiant de la leçon doit être un nombre entier.")
    .optional(),
  param("parent")
    .isString()
    .withMessage("Le parent doit être une chaîne de caractères.")
    .isIn(["resource", "lesson"])
    .withMessage('Le parent doit être soit "resource" soit "lesson".'),
  body("data.title")
    .isString()
    .withMessage("Le titre doit être une chaîne de caractères.")
    .custom(stringValidateGeneric)
    .withMessage("Le titre de l'image contient des caractères non autorisés."),
  body("data.url")
    .isString()
    .withMessage("L'URL doit être une chaîne de caractères.")
    .custom(stringValidateOptional)
    .withMessage("L'URL de l'image contient des caractères non autorisés.")
    .optional(),
  checkValidatorResult,
];

export const putImageValidator = [
  param("activityIdId")
    .isNumeric()
    .withMessage("L'identifiant de l'activité doit être un nombre entier.")
    .optional(),
  param("parent")
    .isString()
    .withMessage("Le parent doit être une chaîne de caractères.")
    .isIn(["resource", "lesson"])
    .withMessage('Le parent doit être soit "resource" soit "lesson".'),
  body("data.title")
    .isString()
    .withMessage("Le titre doit être une chaîne de caractères.")
    .custom(stringValidateGeneric)
    .withMessage("Le titre de l'image contient des caractères non autorisés."),
  body("data.url")
    .isString()
    .withMessage("L'URL doit être une chaîne de caractères.")
    .custom(stringValidateOptional)
    .withMessage("L'URL de l'image contient des caractères non autorisés.")
    .optional(),
  checkValidatorResult,
];
