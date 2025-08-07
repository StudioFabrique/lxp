import { body, param } from "express-validator";

import { checkValidatorResult } from "../../../middleware/validators";
import {
  numberValidateGeneric,
  stringValidateGeneric,
  stringValidateOptional,
} from "../../../helpers/custom-validators";
import { regexNumber } from "../../../utils/constantes";

export const fomrationIdValidator = [
  param("formationId")
    .notEmpty()
    .withMessage("Un identifiant est requis pour la formation.")
    .custom(numberValidateGeneric)
    .withMessage("L'identifiant doit être un nombre."),
];

export const postFormationValidator =
  // Valider le champ 'title'
  [
    body("title")
      .isString()
      .withMessage('Le champ "title" doit être une chaîne de caractères')
      .custom(stringValidateGeneric)
      .withMessage(
        "Le titre de la formation contient des caractères non autorisés."
      ),

    // Valider le champ 'description'
    body("description")
      .isString()
      .withMessage('Le champ "description" doit être une chaîne de caractères')
      .custom(stringValidateOptional)
      .withMessage(
        "La description de la formation contient des caractères non autorisés."
      )
      .optional(),

    // Valider le champ 'level'
    body("level")
      .isString()
      .withMessage('Le champ "level" doit être une chaîne de caractères')
      .custom(stringValidateGeneric)
      .withMessage(
        "Le niveau de la formation contient des caractères non autorisés."
      ),

    // Valider le champ 'code'
    body("code")
      .isString()
      .withMessage('Le champ "code" doit être une chaîne de caractères')
      .custom(stringValidateOptional)
      .withMessage(
        "Le code de la formation contient des caractères non autorisés."
      )
      .optional(),

    // Valider le champ 'tags'
    body("tags")
      .isArray()
      .withMessage("Un tableau est requis")
      .custom((arr) => Array.isArray(arr) && arr.length > 0)
      .withMessage("Le tableau ne peut pas être vide"),
    body("tags.*")
      .isNumeric()
      .withMessage("Chaque tag doit être un nombre entier"),
  ];

export const putFormationValidator = [
  // Valider le champ 'title'
  body("formation.title")
    .isString()
    .withMessage('Le champ "title" doit être une chaîne de caractères')
    .custom(stringValidateGeneric)
    .withMessage(
      "Le titre de la formation contient des caractères non autorisés."
    ),

  // Valider le champ 'description'
  body("formation.description")
    .optional()
    .isString()
    .withMessage('Le champ "description" doit être une chaîne de caractères')
    .custom(stringValidateOptional)
    .withMessage(
      "La description de la formation contient des caractères non autorisés."
    ),

  // Valider le champ 'level'
  body("formation.level")
    .isString()
    .withMessage('Le champ "level" doit être une chaîne de caractères')
    .custom(stringValidateGeneric)
    .withMessage(
      "Le niveau de la formation contient des caractères non autorisés."
    ),

  // Valider le champ 'code'
  body("formation.code")
    .optional()
    .isString()
    .withMessage('Le champ "code" doit être une chaîne de caractères')
    .custom(stringValidateOptional)
    .withMessage(
      "Le code de la formation contient des caractères non autorisés."
    )
    .withMessage("Le tableau ne peut pas être vide"),

  // Valider le champ 'tags'
  body("formation.tags")
    .isArray()
    .withMessage('Le champ "tags" doit être un tableau')
    .custom((arr) => Array.isArray(arr) && arr.length > 0)
    .withMessage("Le tableau ne peut pas être vide"),

  // Valider chaque tag dans le tableau 'tags'
  body("formation.tags.*")
    .isNumeric()
    .withMessage("Chaque tag doit être un nombre entier"),
];

export const createFormationValidation = [
  body("title")
    .notEmpty()
    .withMessage("Le titre est requis")
    .isString()
    .withMessage("Le titre doit être une chaîne de caractères"),

  body("description")
    .notEmpty()
    .withMessage("La description est requise")
    .isString()
    .withMessage("La description doit être une chaîne de caractères"),

  body("code")
    .notEmpty()
    .withMessage("Le code est requis")
    .isString()
    .withMessage("Le code doit être une chaîne de caractères"),

  body("level")
    .notEmpty()
    .withMessage("Le niveau est requis")
    .isString()
    .withMessage("Le niveau doit être une chaîne de caractères"),

  body("tags")
    .isArray({ min: 1 })
    .withMessage("Les tags doivent être un tableau non vide")
    .custom((tags) => {
      if (!tags.every((tag: any) => Number.isInteger(tag))) {
        throw new Error("Les tags doivent être des entiers");
      }
      return true;
    }),
];
