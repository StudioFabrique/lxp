import { body, param, query } from "express-validator";
import { checkValidatorResult } from "../../../middleware/validators.ts";
import { regexStringManyMongoId } from "../../../utils/constantes.ts";
import { stringValidateGeneric } from "../../../helpers/custom-validators.ts";

export const getPermissionsValidator = (queryParam: "role" | "id") => [
  param(queryParam)
    [queryParam === "id" ? "isMongoId" : "isString"]()
    .withMessage(queryParam === "id" ? "ID invalide" : "Role invalide")
    .notEmpty()
    .withMessage(queryParam === "id" ? "ID absent" : "Role absent")
    .escape(),

  checkValidatorResult,
];

export const postRoleValidator = [
  body(["role", "label"])
    .isString()
    .withMessage("Role invalide")
    .notEmpty()
    .withMessage("Role absent")
    .custom((value) => !value.includes(":"))
    .withMessage("Le role ne peut pas contenir le caractère ':'")
    .toLowerCase()
    .trim()
    .custom(stringValidateGeneric)
    .withMessage("Le role ne peut pas contenir de caractères spéciaux"),
  body("rank")
    .isNumeric()
    .withMessage("Rang invalide")
    .notEmpty()
    .withMessage("Rang absent"),

  checkValidatorResult,
];

export const deleteRoleValidator = [
  param("roleId")
    .isMongoId()
    .withMessage("Role invalide")
    .notEmpty()
    .withMessage("Role absent")
    .escape(),

  checkValidatorResult,
];

export const deleteManyRolesValidator = [
  query("ids")
    .matches(regexStringManyMongoId)
    .withMessage("IDs de roles invalides"),

  checkValidatorResult,
];

export const putRoleValidator = [
  param("id")
    .isMongoId()
    .withMessage("_id invalide")
    .notEmpty()
    .withMessage("_id absent")
    .escape(),

  body(["role", "label"])
    .isString()
    .withMessage("Role invalide")
    .notEmpty()
    .withMessage("Role absent")
    .custom((value) => !value.includes(":"))
    .withMessage("Le role ne peut pas contenir le caractère ':'")
    .toLowerCase()
    .trim()
    .escape(),

  body("rank")
    .isNumeric()
    .withMessage("Rang invalide")
    .notEmpty()
    .withMessage("Rang absent"),

  checkValidatorResult,
];

export const removePermissionValidator = [
  param("roleId")
    .isMongoId()
    .withMessage("Role ID invalide")
    .notEmpty()
    .withMessage("Role ID absent")
    .escape(),
  param("permission")
    .isString()
    .withMessage("Permission invalide")
    .notEmpty()
    .withMessage("Permission absente")
    .escape(),

  checkValidatorResult,
];

// Validateur pour vérifier que l'ID du role est un ID MongoDB valide
export const roleIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("L'identifiant de l'utilisateur est invalide."),
];

export const searchRoleValidator = [
  param("searchValue")
    .isString()
    .withMessage("Valeur invalide")
    .notEmpty()
    .withMessage("Valeur absente")
    .escape(),
];
