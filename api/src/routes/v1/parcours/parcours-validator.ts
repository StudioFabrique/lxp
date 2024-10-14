import { body, param } from "express-validator";

import { checkValidatorResult } from "../../../middleware/validators";
import {
  stringValidateGeneric,
  stringValidateOptional,
} from "../../../helpers/custom-validators";

export const postParcoursValidator = [
  body("formation")
    .isNumeric()
    .withMessage("Identifiant de formation non valide")
    .notEmpty()
    .withMessage("Identifiant de formation absent")
    .escape(),
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Le titre du parcours doit avoir au moins 1 caractère")
    .custom(stringValidateGeneric)
    .withMessage("Le titre du parcours contient des caractères non autorisés."),
  checkValidatorResult,
];

export const parcoursByIdValidator = [
  param("parcoursId")
    .isNumeric()
    .withMessage("Identifiant de parcours invalide")
    .notEmpty()
    .withMessage("Identifiant de parcours absent")
    .escape(),
  checkValidatorResult,
];

export const getParcoursByFormationValidator = [
  param("formationId")
    .isNumeric()
    .withMessage("Identifiant de formation invalide")
    .notEmpty()
    .withMessage("Identifiant de formation absent")
    .escape(),
  checkValidatorResult,
];

export const updateInfosValidator = [
  body("parcoursId")
    .isNumeric()
    .withMessage("Identifiant de parcours invalide")
    .notEmpty()
    .withMessage("Identifiant de parcours absent")
    .escape(),
  body("title")
    .notEmpty()
    .withMessage("Le titre du parcours doit avoir au moins 1 caractère")
    .custom(stringValidateGeneric)
    .withMessage("Le titre du parcours contient des caractères invalides.")
    .trim(),
  body("description")
    .optional()
    .custom(stringValidateOptional)
    .withMessage("La description contient des caractères invalides."),
  body("formation")
    .isNumeric()
    .withMessage("Identifiant de formation invalide")
    .notEmpty()
    .withMessage("Identifiant de formation absent")
    .escape(),
  body("visibility")
    .notEmpty()
    .withMessage("La visibilité du parcours est requise.")
    .isBoolean()
    .withMessage("La visibilité du parcours doit être une valeur booléenne."),
  checkValidatorResult,
];

export const updateDatesValidator = [
  body("parcoursId")
    .isNumeric()
    .withMessage("Identifiant de parcours invalide")
    .notEmpty()
    .withMessage("Identifiant de parcours absent")
    .escape(),
  body("startDate")
    .notEmpty()
    .withMessage("Date de début absente")
    .custom(stringValidateGeneric)
    .withMessage("La date contient des caractères non autorisés.")
    .trim()
    .escape(),
  body("endDate")
    .notEmpty()
    .withMessage("Date de fin absente")
    .custom(stringValidateGeneric)
    .withMessage("La date contient des caractères non autorisés.")
    .trim()
    .escape(),
  checkValidatorResult,
];

export const putParcoursTagsValidator = [
  body("parcoursId")
    .isNumeric()
    .withMessage("Identifiant de parcours invalide")
    .notEmpty()
    .withMessage("Identifiant de parcours absent")
    .escape(),
  body("tags").isArray().notEmpty().withMessage("Tags absents"),
  body("tags.*")
    .isNumeric()
    .withMessage("Les tags doivent être des nombres")
    .notEmpty(),
  checkValidatorResult,
];

export const putParcoursContactsValidator = [
  body("parcoursId")
    .notEmpty()
    .withMessage("Identifiant de parcours absent")
    .isNumeric()
    .withMessage("Identifiant de parcours invalide")
    .escape(),
  body("contacts").isArray().notEmpty().withMessage("Contacts absents"),
  body("contacts.*.id").isNumeric().withMessage("Id contact invalide").escape(),
  body("contacts.*.idMdb")
    .notEmpty()
    .withMessage("Id nosql absent")
    .custom(stringValidateGeneric)
    .withMessage(
      "Caractères non autorisés pour l'identifiant nosql du contact.",
    )
    .escape(),
  body("contacts.*.name")
    .notEmpty()
    .withMessage("Nom absent")
    .custom(stringValidateGeneric)
    .withMessage("Caractères non autorisés pour le nom du contact.")
    .escape(),
  body("contacts.*.role")
    .notEmpty()
    .withMessage("Role absent")
    .custom(stringValidateGeneric)
    .withMessage("Caractères non autorisés pour le rôle du contact.")
    .escape(),
  checkValidatorResult,
];

export const parcoursIdValidator = [
  param("parcoursId")
    .notEmpty()
    .withMessage("L'identifiant du parcours est requis")
    .isNumeric()
    .withMessage("L'identifiant du parcours n'est pas requis"),
  checkValidatorResult,
];

export const virtualClassValidator = [
  body("parcoursId")
    .isNumeric()
    .withMessage("Identifiant de parcours invalide")
    .notEmpty()
    .withMessage("Identifiant de parcours absent")
    .escape(),
  body("virtualClass")
    .isURL()
    .withMessage("Url non valide")
    .notEmpty()
    .withMessage("Url absente"),
  checkValidatorResult,
];
