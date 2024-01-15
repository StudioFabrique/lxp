import { body, param } from "express-validator";
import { stringValidateGeneric } from "../../../helpers/custom-validators";
import { checkValidatorResult } from "../../../middleware/validators";

export const lessonIdValidator = [
  param("lessonId")
    .notEmpty()
    .withMessage("L'idientifiant de la leçon est requis.")
    .isNumeric()
    .isInt()
    .withMessage("L'identifiant de la leçon doit être un nombre entier."),
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
    .withMessage("Un titre est requis pour la leçon")
    .custom(stringValidateGeneric)
    .withMessage("Le titre de la leçon contient des caractères non autorisés"),
  body("description")
    .notEmpty()
    .withMessage("Une description est requise pour la leçon")
    .custom(stringValidateGeneric)
    .withMessage(
      "La description de la leçon contient des caractères non autorisés"
    ),
  body("modalite")
    .notEmpty()
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
