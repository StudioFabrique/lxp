import { body, param, query } from "express-validator";
import {
  stringValidateGeneric,
  stringValidateOptional,
} from "../../../helpers/custom-validators.ts";
import { checkValidatorResult } from "../../../middleware/validators.ts";

export const lessonIdValidator = [
  param("lessonId")
    .notEmpty()
    .withMessage("L'idientifiant de la leçon est requis.")
    .isNumeric()
    .isInt()
    .withMessage("L'identifiant de la leçon doit être un nombre entier."),
];

export const duplicateLessonValidator = [
  param("courseId")
    .notEmpty()
    .withMessage("L'idientifiant du cours est requis.")
    .isNumeric()
    .isInt()
    .withMessage("L'identifiant du cours doit être un nombre entier."),
  /*
  body("lessonId")
    .notEmpty()
    .withMessage("L'idientifiant de la leçon est requis.")
    .isNumeric()
    .isInt()
    .withMessage("L'identifiant de la leçon doit être un nombre entier."),
    */
  checkValidatorResult,
];

export const duplicateResourcesValidator = [
  param("courseId")
    .notEmpty()
    .withMessage("L'identifiant du cours est requis.")
    .isInt()
    .withMessage("L'identifiant du cours doit être un nombre entier."),
  body()
    .isArray({ min: 1 })
    .withMessage("La requête requiert au moins une ressource."),
  body("*")
    .isInt()
    .withMessage("Les identifiants des ressources doivent être des entiers."),
  checkValidatorResult,
];


export const parentIdValidator = [
  param("parentId")
    .notEmpty()
    .withMessage("L'idientifiant du parent est requis.")
    .isNumeric()
    .isInt()
    .withMessage("L'identifiant du parent doit être un nombre entier."),
];

export const lessonRateValidator = [
  body("rate")
    .notEmpty()
    .withMessage("La note est obligatoire")
    .isNumeric()
    .withMessage("La note attribué doit être un nombre")
    .isFloat({ min: 0, max: 5 })
    .withMessage("La note doit être comprise entre 0 et 5")
    .trim()
    .escape(),
];

export const putLessonValidator = [
  body("id")
    .notEmpty()
    .withMessage("L'identifiant de la leçon est requis")
    .isNumeric()
    .withMessage("L'identifiant de la leçon doit être un nombre")
    .trim()
    .escape(),
  body("title")
    .notEmpty()
    .isString()
    .withMessage("Un titre est requis pour la leçon")
    .custom(stringValidateGeneric)
    .withMessage("Le titre de la leçon contient des caractères non autorisés"),
  body("description")
    .optional({ nullable: true })
    .isString()
    .withMessage(
      "La description de la leçon doit être une chaîne de caractères",
    )
    .custom(stringValidateOptional)
    .withMessage(
      "La description de la leçon contient des caractères non autorisés"
    ),
  body("modalite")
    .notEmpty()
    .isString()
    .withMessage("Une modalité est requise pour la leçon")
    .custom(stringValidateGeneric)
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

export const getLessonsByTagValidator = [
  param("tagId")
    .notEmpty()
    .withMessage("L'identifiant du tag est requis")
    .isNumeric()
    .withMessage("L'identifiant du tag doit être un nombre")
    .trim()
    .escape(),
  query("includeCourseContents")
    .optional()
    .isBoolean()
    .withMessage("Le filtre des contenus de cours doit être un booléen"),
  query("supplementaryResources")
    .optional()
    .isBoolean()
    .withMessage(
      "Le filtre des ressources supplémentaires doit être un booléen",
    ),
  checkValidatorResult,
];

export const putReorderLessonsValidator = [
  param("courseId")
    .notEmpty()
    .withMessage("L'idientifiant du cours est requis.")
    .isNumeric()
    .isInt()
    .withMessage("L'identifiant du cours doit être un nombre entier."),
  body()
    .isArray()
    .notEmpty()
    .withMessage("La requête requiert un tableau.")
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
