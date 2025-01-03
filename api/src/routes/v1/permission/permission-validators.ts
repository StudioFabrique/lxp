import { body, param, query } from "express-validator";
import { checkValidatorResult } from "../../../middleware/validators";
import { regexStringManyMongoId } from "../../../utils/constantes";

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
    .withMessage("Champ invalide")
    .notEmpty()
    .withMessage("Champ absent")
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
