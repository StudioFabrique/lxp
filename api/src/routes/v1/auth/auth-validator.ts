/**
 * Validators pour les endpoints liés à l'authentification
 */

import { body } from "express-validator";

import { passwordValidateGeneric } from "../../../helpers/custom-validators";
import { checkValidatorResult } from "../../../middleware/validators";

export const loginValidator = [
  body("email").isEmail().withMessage("Email invalide").trim().escape(),
  body("password")
    .notEmpty()
    .withMessage("Le mot de passe est requis.")
    .isString()
    .withMessage("Le mot de passe doit être une chaîne de caractères.")
    .custom(passwordValidateGeneric)
    .withMessage("Identifiants incorrects."),
  checkValidatorResult,
];
