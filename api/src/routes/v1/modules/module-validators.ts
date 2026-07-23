import { body, param } from "express-validator";
import { checkValidatorResult } from "../../../middleware/validators";
import {
  dateValidateGeneric,
  stringValidateGeneric,
  stringValidateOptional,
} from "../../../helpers/custom-validators";

export const moduleIdValidator = [
  param("moduleId")
    .notEmpty()
    .withMessage("L'identifiant du module est requis")
    .isNumeric()
    .withMessage("L'identifiant du module n'est pas requis"),
  checkValidatorResult,
];

export const moduleIdFromBodyValidator = [
  body("moduleId")
    .isNumeric()
    .withMessage("Identifiant de module non valide")
    .notEmpty()
    .withMessage("Un identifiant de module est requise")
    .trim()
    .escape(),
  checkValidatorResult,
];

export const getModulesFromParcoursValidator = [
  param("parcoursId")
    .isNumeric()
    .withMessage("Identifiant de parcours non valide")
    .notEmpty()
    .withMessage("Un identifiant de parcours est requise")
    .trim()
    .escape(),
  checkValidatorResult,
];

export const getModuleFormationValidator = [
  param("formationId")
    .trim()
    .notEmpty()
    .withMessage("L'identifiant de la formation est requis")
    .isNumeric()
    .withMessage("L'identifiant de la formation doit être un nombre entier")
    .escape(),
  param("duplicate")
    .isBoolean()
    .withMessage("Le paramètre 'duplicate' doit être un booléen")
    .optional(),
  checkValidatorResult,
];

export const updateDatesModulesValidator = [
  body("minDate")
    .trim()
    .notEmpty()
    .withMessage("Une date de début est requise")
    .custom(dateValidateGeneric)
    .withMessage("La date de début du module contient des caractères invalides")
    .escape(),
  body("maxDate")
    .trim()
    .notEmpty()
    .withMessage("Une date de fin est requise")
    .custom(dateValidateGeneric)
    .withMessage("La date de fin du module contient des caractères invalides")
    .escape(),
  checkValidatorResult,
];

export const putModuleValidator = [
  body("module").isObject().notEmpty(),
  body("module.id")
    .isNumeric()
    .withMessage("Identifiant de module non valide")
    .notEmpty()
    .withMessage("Un identifiant de module est requise"),
  body("module.title")
    .isString()
    .withMessage("Le titre doit être une chaîne de caractères.")
    .notEmpty()
    .withMessage("Le titre est obligatoire.")
    .custom(stringValidateGeneric),
  body("module.description")
    .optional() // Optionnel
    .custom(stringValidateOptional)
    .withMessage("La description du module contient des caractères invalides."),
  body("module.duration")
    .isInt({ gt: 0 })
    .withMessage("La durée doit être un nombre entier positif.")
    .optional(),
  body("module.contactsIds")
    .isArray()
    .withMessage("contactsIds doit être un tableau.")
    .bail()
    .custom((value) =>
      value.every((id: number) => Number.isInteger(id) && id > 0),
    )
    .withMessage(
      "Chaque identifiant de contactsIds doit être un entier positif.",
    ),
  body("module.bonusSkillsIds")
    .isArray()
    .withMessage("bonusSkillsIds doit être un tableau.")
    .bail()
    .custom((value) =>
      value.every((id: number) => Number.isInteger(id) && id > 0),
    )
    .withMessage(
      "Chaque identifiant de bonusSkillsIds doit être un entier positif.",
    ),
];

export const putModuleParcoursValidator = [
  body("module").isObject().notEmpty(),
  body("parcoursId")
    .isNumeric()
    .withMessage("Identifiant de parcours non valide")
    .notEmpty()
    .withMessage("Un identifiant de parcours est requise"),
  body("module.title")
    .isString()
    .withMessage("Le titre doit être une chaîne de caractères.")
    .notEmpty()
    .withMessage("Le titre est obligatoire.")
    .custom(stringValidateGeneric),
  body("module.description")
    .optional() // Optionnel
    .isString()
    .withMessage("La description doit être une chaîne de caractères.")
    .custom(stringValidateOptional),
  body("module.duration")
    .isInt({ gt: 0 })
    .withMessage("La durée doit être un nombre entier positif."),
  body("module.contactsIds")
    .isArray()
    .withMessage("contactsIds doit être un tableau.")
    .bail()
    .custom((value) =>
      value.every((id: number) => Number.isInteger(id) && id > 0),
    )
    .withMessage(
      "Chaque identifiant de contactsIds doit être un entier positif.",
    ),
  body("module.bonusSkillsIds")
    .isArray()
    .withMessage("bonusSkillsIds doit être un tableau.")
    .bail()
    .custom((value) =>
      value.every((id: number) => Number.isInteger(id) && id > 0),
    )
    .withMessage(
      "Chaque identifiant de bonusSkillsIds doit être un entier positif.",
    ),
  checkValidatorResult,
];
