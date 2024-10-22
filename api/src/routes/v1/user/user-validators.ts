import { body, param } from "express-validator";
import {
  passwordValidateGeneric,
  stringValidateGeneric,
  tokenValidateGeneric,
} from "../../../helpers/custom-validators";
import { checkValidatorResult } from "../../../middleware/validators";

export const userIdValidator = [
  param("userId")
    .isMongoId()
    .withMessage("L'identifiant de l'utilisateur est invalide."),
  checkValidatorResult,
];

export const tokenValidator = [
  body("token").custom(tokenValidateGeneric),
  checkValidatorResult,
];

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
      "Le corps de la requête doit contenir un tableau d'identifiants.",
    )
    .notEmpty()
    .withMessage(
      "Le corps de la requête doit contenir un tableau d'identifiants.",
    ),
];

export const postPasswordValidator = [
  body("token")
    .custom(tokenValidateGeneric)
    .withMessage("Le token contient des caractères non autorisés."),
  body("password")
    .custom(passwordValidateGeneric)
    .withMessage("Le mot de passe n'est pas valide."),
  checkValidatorResult,
];
