import { body } from "express-validator";

import { checkValidatorResult } from "../../../middleware/validators";
import { stringValidateGeneric } from "../../../helpers/custom-validators";

export const postFormationValidator = [
  // Valider le champ 'title'
  body("title")
    .trim()
    .notEmpty()
    .withMessage('Le champ "title" ne peut pas être vide')
    .isString()
    .withMessage('Le champ "title" doit être une chaîne de caractères')
    .custom(stringValidateGeneric)
    .withMessage(
      "Le titre de la formation contient des caractères non autorisés."
    ),

  // Valider le champ 'description'
  body("description")
    .trim()
    .notEmpty()
    .withMessage('Le champ "description" ne peut pas être vide')
    .isString()
    .withMessage('Le champ "description" doit être une chaîne de caractères')
    .custom(stringValidateGeneric)
    .withMessage(
      "La description de la formation contient des caractères non autorisés."
    ),

  // Valider le champ 'level'
  body("level")
    .trim()
    .notEmpty()
    .withMessage('Le champ "level" ne peut pas être vide')
    .isString()
    .withMessage('Le champ "level" doit être une chaîne de caractères')
    .custom(stringValidateGeneric)
    .withMessage(
      "Le niveau de la formation contient des caractères non autorisés."
    ),

  // Valider le champ 'code'
  body("code")
    .trim()
    .notEmpty()
    .withMessage('Le champ "code" ne peut pas être vide')
    .isString()
    .withMessage('Le champ "code" doit être une chaîne de caractères')
    .custom(stringValidateGeneric)
    .withMessage(
      "Le code de la formation contient des caractères non autorisés."
    ),

  // Valider le champ 'tags'
  body("tags")
    .isArray()
    .withMessage('Le champ "tags" doit être un tableau')
    .notEmpty()
    .withMessage('Le champ "tags" ne peut pas être vide')
    .custom((tags: any) => {
      if (!tags.every((tag: any) => typeof tag === "number")) {
        throw new Error('Chaque élément du tableau "tags" doit être un nombre');
      }
      return true;
    }),
  checkValidatorResult,
];
