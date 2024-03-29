import { body, param } from "express-validator";
import { checkValidatorResult } from "../../../middleware/validators";
import {
  stringValidateGeneric,
  stringValidateOptional,
  videoUrlValidate,
} from "../../../helpers/custom-validators";

export const activityIdValidator = [
  param("activityId")
    .notEmpty()
    .withMessage("L'idientifiant de l'activité est requis.")
    .isNumeric()
    .isInt()
    .withMessage("L'identifiant de l'activité doit être un nombre entier."),
  checkValidatorResult,
];

export const updateActivityValidator = [
  body("url")
    .notEmpty()
    .withMessage("L'url de l'activité est requise.")
    .isURL()
    .withMessage("Format d'url non valide."),
  body("order")
    .notEmpty()
    .withMessage("La propriété order est requise.")
    .isNumeric()
    .isInt()
    .withMessage("La propriété order doit être un nombre entier."),
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
  body("data.description")
    .isString()
    .withMessage(
      "La description de la video doit être une chaîne de caractères."
    )
    .custom(stringValidateOptional)
    .withMessage(
      "La description de la video contient des caractères non autorisés."
    ),
  checkValidatorResult,
];

export const postVideoValidator = [
  body("data.type")
    .notEmpty()
    .withMessage("Le type de l'activité est requis.")
    .isString()
    .withMessage("Le type de l'activité doit être une chaîne de caractères.")
    .custom(stringValidateGeneric)
    .withMessage("Le type de l'activité contient des caractères invalides."),
  body("data.order")
    .notEmpty()
    .withMessage("La propriété order est requise.")
    .isNumeric()
    .isInt()
    .withMessage("La propriété order doit être un nombre entier."),
  body("data.title")
    .notEmpty()
    .withMessage("Le titre de la video est obligatoire.")
    .isString()
    .withMessage("Le titre de la video doit être une chaîne de caractères.")
    .custom(stringValidateGeneric)
    .withMessage("Le titre de la video contient des caractères non autorisés."),
  body("data.description")
    .isString()
    .withMessage(
      "La description de la video doit être une chaîne de caractères."
    )
    .custom(stringValidateOptional)
    .withMessage(
      "La description de la video contient des caractères non autorisés."
    ),
  checkValidatorResult,
];

export const putReorderActivitiesValidator = [
  body()
    .isArray()
    .notEmpty()
    .withMessage("La leçon requiert un tableau d'identifiants.")
    .notEmpty(),
  body("*")
    .notEmpty()
    .withMessage(
      "Le tableau d'identifiants doit contenir une ou plusieurs valeurs."
    )
    .isNumeric()
    .withMessage(
      "Le tableau d'identifiants doit contenir des nombres entiers uniquement."
    ),
  checkValidatorResult,
];
