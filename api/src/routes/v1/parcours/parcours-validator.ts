import { body, param } from "express-validator";

import { checkValidatorResult } from "../../../middleware/validators";

export const postParcoursValidator = [
  body("formation")
    .isNumeric()
    .withMessage("Identifiant de formation non valide")
    .notEmpty()
    .withMessage("Identifiant de formation absent")
    .escape(),
  body("title")
    .isString()
    .withMessage("Titre de parcours non valide")
    .notEmpty()
    .withMessage("Le titre du parcours doit avoir au moins 1 caractère")
    .trim()
    .escape(),
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
    .isString()
    .withMessage("Titre de parcours non valide")
    .notEmpty()
    .withMessage("Le titre du parcours doit avoir au moins 1 caractère")
    .trim()
    .escape(),
  body("description")
    .isString()
    .withMessage("Description invalide")
    .notEmpty()
    .withMessage("Description absente")
    .escape(),
  body("formation")
    .isNumeric()
    .withMessage("Identifiant de formation invalide")
    .notEmpty()
    .withMessage("Identifiant de formation absent")
    .escape(),
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
    .isString()
    .withMessage("Date de début non valide")
    .notEmpty()
    .withMessage("Date de début absente")
    .trim()
    .escape(),
  body("endDate")
    .isString()
    .withMessage("Date de fin non valide")
    .notEmpty()
    .withMessage("Date de fin absente")
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
    .isNumeric()
    .withMessage("Identifiant de parcours invalide")
    .notEmpty()
    .withMessage("Identifiant de parcours absent")
    .escape(),
  body("contacts").isArray().notEmpty().withMessage("Contacts absents"),
  body("contacts.*.id").isNumeric().withMessage("Id contact invalide").escape(),
  body("contacts.*.idMdb")
    .isString()
    .withMessage("Id nosql invalide")
    .notEmpty()
    .withMessage("Id nosql absent")
    .escape(),
  body("contact.*.name")
    .isString()
    .withMessage("Nom invalide")
    .notEmpty()
    .withMessage("Nom absent")
    .escape(),
  body("contact.*.role")
    .isString()
    .withMessage("Role invalide")
    .notEmpty()
    .withMessage("Role absent")
    .escape(),
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
