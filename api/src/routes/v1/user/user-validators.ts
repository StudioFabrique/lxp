import { query, param, body } from "express-validator";
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

export const updateManyUsersStatusValidator = [
  body()
    .isArray()
    .withMessage(
      "Le corps de la requête doit contenir un tableau d'identifiants."
    )
    .notEmpty()
    .withMessage(
      "Le corps de la requête doit contenir un tableau d'identifiants."
    ),
];
