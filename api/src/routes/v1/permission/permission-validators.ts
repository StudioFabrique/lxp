import { body, param } from "express-validator";
import { checkValidatorResult } from "../../../middleware/validators";

export const getPermissionsValidator = [
  param("role")
    .isString()
    .withMessage("Role invalide")
    .notEmpty()
    .withMessage("Role absent")
    .escape(),

  checkValidatorResult,
];

export const postRoleValidator = [
  body(["role" /* ,"role.description" */])
    .isString()
    .withMessage("Role invalide")
    .notEmpty()
    .withMessage("Role absent")
    .escape(),
  body("rank")
    .isNumeric()
    .withMessage("Rank invalide")
    .notEmpty()
    .withMessage("Rank absent")
    .escape(),

  checkValidatorResult,
];

export const deleteRoleValidator = [
  param("role")
    .isString()
    .withMessage("Role invalide")
    .notEmpty()
    .withMessage("Role absent")
    .escape(),

  checkValidatorResult,
];

export const putRoleValidator = [
  param("id")
    .isString()
    .withMessage("_id invalide")
    .notEmpty()
    .withMessage("_id absent")
    .escape(),

  // body("role").isString().withMessage("Role invalide").escape(),

  body("permissions.*.action")
    .isString()
    .withMessage("L'action doit être une chaîne de caractère")
    .notEmpty(),

  checkValidatorResult,
];
