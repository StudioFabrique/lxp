import { body, param, query } from "express-validator";

import { checkValidatorResult } from "../../../middleware/validators";
import {
  dateValidateGeneric,
  stringValidateGeneric,
  stringValidateOptional,
} from "../../../helpers/custom-validators";

export const courseIdValidator = [
  param("courseId")
    .notEmpty()
    .withMessage("L'identifiant du cours est requis")
    .isNumeric()
    .withMessage("L'identifiant du cours doit être un nombre")
    .trim()
    .escape(),
  checkValidatorResult,
];

export const postCourseValidator = [
  body("title")
    .notEmpty()
    .withMessage("Le titre du cours est requis")
    .isString()
    .withMessage("Le titre du cours n'est pas conforme"),
  body("moduleId")
    .notEmpty()
    .withMessage("L'identifiant du module est requis")
    .isNumeric()
    .withMessage("L'identifiant du module n'est pas conforme")
    .escape(),
  checkValidatorResult,
];

export const putCourseInformationsValidator = [
  body("id")
    .notEmpty()
    .withMessage("L'identifiant du cours est requis")
    .isNumeric()
    .withMessage("L'identifiant du cours doit être un nombre")
    .trim()
    .escape(),
  body("title")
    .notEmpty()
    .withMessage("Le titre du cours est requis")
    .custom(stringValidateGeneric)
    .withMessage("Le titre du cours n'est pas conforme"),
  body("description")
    .custom(stringValidateOptional)
    .withMessage("La description du cours n'est pas conforme"),
  body("visibility")
    .notEmpty()
    .withMessage("Une valeur est requise pour la visibilité du cours")
    .isBoolean()
    .withMessage("La visibilité du cours doit être une valeur booléenne"),
  checkValidatorResult,
];

export const putCourseNewObjectiveValidator = [
  body("description")
    .notEmpty()
    .withMessage("Une description est requise pour l'objectif")
    .custom(stringValidateGeneric)
    .withMessage(
      "La description de l'objectif contient des caractères non autorisés"
    ),
  checkValidatorResult,
];

export const putCourseLessonValidator = [
  body("title")
    .notEmpty()
    .withMessage("Un titre est requis pour la leçon")
    .custom(stringValidateGeneric)
    .withMessage("Le titre de la leçon contient des caractères non autorisés"),
  body("description") /* 
    .notEmpty()
    .withMessage("Une description est requise pour la leçon") */
    .custom(stringValidateOptional)
    .withMessage(
      "La description de la leçon contient des caractères non autorisés"
    ),
  body("modalite")
    .notEmpty()
    .withMessage("Une modalité est requise pour la leçon")
    .isString()
    .withMessage(
      "La modalité de la leçon contient des caractères non autorisés"
    ),
  body("tagId")
    .notEmpty()
    .withMessage("Un identifiant est requis pour le tag de la leçon")
    .isInt()
    .withMessage("L'identifiant du tag n'est pas un nombre entier"),
  checkValidatorResult,
];

export const deleteCourseLessonValidator = [
  param("lessonId")
    .notEmpty()
    .withMessage("L'identifiant de la leçon est requis")
    .isNumeric()
    .withMessage("L'identifiant de la leçon doit être un nombre")
    .trim()
    .escape(),
  checkValidatorResult,
];

export const putCourseDurationValidator = [
  body("synchroneDuration")
    .isInt()
    .withMessage("La durée synchrone du cours doit être un nombre entier")
    .trim()
    .escape(),
  body("asynchroneDuration")
    .isInt()
    .withMessage("La durée asynchrone du cours doit être un nombre entier")
    .trim()
    .escape(),
  checkValidatorResult,
];

export const putCourseDatesValidator = [
  body("minDate")
    .custom(dateValidateGeneric)
    .withMessage("La date fournie contient des caractères non autorisés")
    .trim()
    .escape(),
  body("maxDate")
    .custom(dateValidateGeneric)
    .withMessage("La date fournie contient des caractères non autorisés")
    .trim()
    .escape(),
  body("id")
    .notEmpty()
    .withMessage("L'identifiant de la plage de dates est requis")
    .isNumeric()
    .withMessage("L'identifiant de la plage de dates doit être un nombre")
    .trim()
    .escape(),
  checkValidatorResult,
];

export const deleteCourseDatesValidator = [
  param("datesId")
    .notEmpty()
    .withMessage("L'identifiant du cours est requis")
    .isNumeric()
    .withMessage("L'identifiant du cours doit être un nombre")
    .trim()
    .escape(),
  checkValidatorResult,
];
