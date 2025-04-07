import { body, param, query } from "express-validator";
import { checkValidatorResult } from "../../../middleware/validators";
import {
  rgbaValidator,
  stringValidateGeneric,
} from "../../../helpers/custom-validators";

export const postManyTagsValidator = [
  // Valider le champ 'tableau'
  body("tags")
    .isArray()
    .withMessage('Le champ "tags" doit être un tableau')
    .custom((tags: any[]) => {
      // Vérifier si chaque élément du tableau est un objet avec les champs 'name' et 'color'
      for (const item of tags) {
        if (
          typeof item !== "object" ||
          !("name" in item) ||
          !("color" in item)
        ) {
          throw new Error(
            'Chaque élément du tableau doit être un objet avec les champs "name" et "color"',
          );
        }
      }
      return true;
    }),
  body("tags.*.name")
    .notEmpty()
    .withMessage("Le nom du tag est obligatoire.")
    .custom(stringValidateGeneric)
    .withMessage("Le nom d'un tag contient des caractères non autorisés."),
  body("tags.*.color")
    .notEmpty()
    .withMessage("La couleur du tag est obligatoire.")
    .custom(rgbaValidator)
    .withMessage("Une couleur d'un tag contient des caractères non autorisés."),
  checkValidatorResult,
];

// Validateur pour vérifier que l'ID utilisateur est un ID MongoDB valide
export const tagIdValidator = [
  param("id").isNumeric().withMessage("L'id du tag est invalide."),
  checkValidatorResult,
];

export const tagPutValidator = [
  param("id").isNumeric().withMessage("L'id du tag est invalide."),
  body("name")
    .notEmpty()
    .withMessage("Le nom du tag est obligatoire.")
    .custom(stringValidateGeneric)
    .withMessage("Le nom d'un tag contient des caractères non autorisés."),
  checkValidatorResult,
];

export const getPaginateTagsValidator = [
  // Path parameters validation
  param("stype")
    .isString()
    .matches(/^(name|color|createdAt|updatedAt|null)$/)
    .withMessage(
      "Le type de tri doit être 'name', 'color', 'createdAt', 'updatedAt' ou 'null'",
    ),

  param("sdir")
    .isString()
    .matches(/^(asc|desc)$/)
    .withMessage("La direction du tri doit être 'asc' ou 'desc'"),

  // Query parameters validation
  query("page")
    .isInt({ min: 1 })
    .withMessage("Le numéro de page doit être un nombre entier positif"),

  query("limit")
    .isInt({ min: 1, max: 15 })
    .withMessage("La limite doit être un nombre entier entre 1 et 100"),

  checkValidatorResult,
];

export const getPaginateSearchTagsValidator = [
  // Path parameters validation
  param("entity")
    .isString()
    .matches(/^(name|color)$/)
    .withMessage("L'entité de recherche doit être 'name' ou 'color'"),

  param("value")
    .isString()
    .notEmpty()
    .withMessage("La valeur de recherche ne peut pas être vide")
    .toLowerCase(),

  param("stype")
    .isString()
    .matches(/^(name|color|createdAt|updatedAt|null)$/)
    .withMessage(
      "Le type de tri doit être 'name', 'color', 'createdAt', 'updatedAt' ou 'null'",
    ),

  param("sdir")
    .isString()
    .matches(/^(asc|desc)$/)
    .withMessage("La direction du tri doit être 'asc' ou 'desc'"),

  // Query parameters validation
  query("page")
    .isInt({ min: 1 })
    .withMessage("Le numéro de page doit être un nombre entier positif"),

  query("limit")
    .isInt({ min: 1, max: 15 })
    .withMessage("La limite doit être un nombre entier entre 1 et 100"),

  checkValidatorResult,
];
