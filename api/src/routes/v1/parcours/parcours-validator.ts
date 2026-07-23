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

export const getParcoursSelectValidator = [
  param("formationId")
    .isNumeric()
    .withMessage("Identifiant de formation invalide")
    .notEmpty()
    .withMessage("Identifiant de formation absent")
    .optional(),
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
      "Caractères non autorisés pour l'identifiant nosql du contact."
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
    .withMessage("L'identifiant du parcours doit être un nombre entier"),
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

export const patchParcoursValidator = [
  param("parcoursId")
    .isInt({ min: 1 })
    .withMessage("Identifiant de parcours invalide"),
  body().custom((value) => {
    const editableFields = [
      "title",
      "description",
      "formationId",
      "startDate",
      "endDate",
      "virtualClass",
      "tagIds",
      "contactIds",
      "objectives",
    ];

    if (!editableFields.some((field) => value[field] !== undefined)) {
      throw new Error("Aucune information à mettre à jour");
    }

    return true;
  }),
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Le titre du parcours doit avoir au moins 1 caractère")
    .custom(stringValidateGeneric)
    .withMessage("Le titre du parcours contient des caractères invalides."),
  body("description")
    .optional({ nullable: true })
    .custom((value) => value === null || stringValidateOptional(value))
    .withMessage("La description contient des caractères invalides."),
  body("formationId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Identifiant de formation invalide"),
  body(["startDate", "endDate"])
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("Date de parcours invalide"),
  body("virtualClass")
    .optional({ nullable: true })
    .custom(
      (value) => value === null || value === "" || /^https?:\/\//i.test(value),
    )
    .withMessage("Url non valide"),
  body(["tagIds", "contactIds"])
    .optional()
    .isArray()
    .withMessage("La liste des identifiants est invalide"),
  body(["tagIds.*", "contactIds.*"])
    .optional()
    .isInt({ min: 1 })
    .withMessage("Un identifiant de relation est invalide"),
  body("objectives")
    .optional()
    .isArray()
    .withMessage("La liste des objectifs est invalide"),
  body("objectives.*")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("La description d'un objectif est absente")
    .custom(stringValidateGeneric)
    .withMessage("La description d'un objectif contient des caractères invalides"),
  checkValidatorResult,
];
