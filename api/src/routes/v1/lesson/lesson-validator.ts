import { body } from "express-validator";
import { stringValidateGeneric } from "../../../helpers/custom-validators";
import { checkValidatorResult } from "../../../middleware/validators";

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
