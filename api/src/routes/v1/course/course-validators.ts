import { body, param, query } from "express-validator";

import { checkValidatorResult } from "../../../middleware/validators";
import {
  dateValidateGeneric,
  stringValidateGeneric,
  stringValidateOptional,
} from "../../../helpers/custom-validators";

/**
 * Valide l'identifiant du cours passé en paramètre
 */
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

export const courseIdAndVisibilityValidator = [
  param("courseId")
    .notEmpty()
    .withMessage("L'identifiant du cours est requis")
    .isNumeric()
    .withMessage("L'identifiant du cours doit être un nombre")
    .trim()
    .escape(),
  query("visibility")
    .notEmpty()
    .withMessage("visibility est requis")
    .isBoolean()
    .withMessage("visibility doit être de type boolean"),
  checkValidatorResult,
];

/**
 * Valide les données lors de la création d'un nouveau cours
 */
export const postCourseValidator = [
  body("title")
    .notEmpty()
    .withMessage("Le titre du cours est requis")
    .custom(stringValidateGeneric)
    .withMessage("Le titre du cours n'est pas conforme"),
  body("moduleId")
    .notEmpty()
    .withMessage("L'identifiant du module est requis")
    .isNumeric()
    .withMessage("L'identifiant du module n'est pas conforme")
    .escape(),
  checkValidatorResult,
];

/**
 * Valide les informations lors de la mise à jour d'un cours
 */
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

/**
 * Valide les données lors de l'ajout d'un nouvel objectif au cours
 */
export const putCourseNewObjectiveValidator = [
  body("description")
    .notEmpty()
    .withMessage("Une description est requise pour l'objectif")
    .custom(stringValidateGeneric)
    .withMessage(
      "La description de l'objectif contient des caractères non autorisés",
    ),
  checkValidatorResult,
];

/**
 * Valide les données lors de l'ajout d'une nouvelle leçon au cours
 */
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
      "La description de la leçon contient des caractères non autorisés",
    ),
  body("modalite")
    .notEmpty()
    .withMessage("Une modalité est requise pour la leçon")
    .isString()
    .withMessage(
      "La modalité de la leçon contient des caractères non autorisés",
    ),
  body("tagId")
    .notEmpty()
    .withMessage("Un identifiant est requis pour le tag de la leçon")
    .isInt()
    .withMessage("L'identifiant du tag n'est pas un nombre entier"),
  checkValidatorResult,
];

/**
 * Valide l'identifiant de la leçon lors de sa suppression
 */
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

/**
 * Valide les durées synchrone et asynchrone du cours
 */
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

/**
 * Valide les dates de début et de fin du cours
 */
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

/**
 * Valide l'identifiant lors de la suppression d'une plage de dates
 */
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

/**
 * Valide les données lors de la réorganisation des cours dans un module
 */
export const putReorderCoursesValidator = [
  param("moduleId")
    .notEmpty()
    .withMessage("L'identifiant du module est requis.")
    .isNumeric()
    .isInt()
    .withMessage("L'identifiant du module doit être un nombre entier."),
  body()
    .isArray()
    .notEmpty()
    .withMessage("La requête requiert un tableau.")
    .notEmpty(),
  body("*")
    .notEmpty()
    .withMessage(
      "Le tableau d'identifiants doit contenir une ou plusieurs valeurs.",
    )
    .isNumeric()
    .withMessage(
      "Le tableau d'identifiants doit contenir des nombres entiers uniquement.",
    ),
  checkValidatorResult,
];

export const postImportCourseStructureValidator = [
  body("title")
    .notEmpty()
    .withMessage("Le titre du cours est requis.")
    .isString()
    .withMessage("Le titre doit être une chaîne de caractères.")
    .custom(stringValidateGeneric)
    .withMessage("Le titre contient des caractères non autorisés."),

  body("description")
    .optional()
    .isString()
    .withMessage("La description doit être une chaîne de caractères."),

  body("courseSlug")
    .optional()
    .isString()
    .withMessage("Le slug du cours doit être une chaîne de caractères."),

  body("moduleId")
    .notEmpty()
    .withMessage("L'identifiant du module est requis.")
    .isInt()
    .withMessage("L'identifiant du module doit être un nombre entier."),

  body("lessons")
    .isArray()
    .withMessage("Les leçons doivent être fournies sous forme de tableau."),

  body("lessons.*.title")
    .notEmpty()
    .withMessage("Le titre de la leçon est requis.")
    .isString()
    .custom(stringValidateGeneric),

  body("lessons.*.isSelected")
    .isBoolean()
    .withMessage("Le statut de sélection de la leçon doit être un booléen."),

  body("lessons.*.modalite")
    .optional()
    .isString()
    .isIn(["elearning", "presenciel", "hybride"])
    .withMessage(
      "La modalité doit être valide (elearning, presenciel, hybride).",
    ),

  checkValidatorResult,
];
