import { param } from "express-validator";
import { checkValidatorResult } from "../../../middleware/validators";

export const permissionsValidator = [
  param("role")
    .isString()
    .withMessage("Role invalide")
    .notEmpty()
    .withMessage("Role absent")
    .escape(),
  checkValidatorResult,
];
