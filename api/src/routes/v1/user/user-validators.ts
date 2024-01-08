import { query, param } from "express-validator";
import { stringValidateGeneric } from "../../../helpers/custom-validators";
import { checkValidatorResult } from "../../../middleware/validators";

export const getUsersByRoleValidator = [
  param("role")
    .notEmpty()
    .withMessage("Le rôle est requis.")
    .isString()
    .withMessage("Le rôle doit être une chaîne de caractères.")
    .custom(stringValidateGeneric)
    .withMessage("Le rôle contient des caractères non autorisés."),
  checkValidatorResult,
];
