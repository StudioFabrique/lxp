import { param } from "express-validator";
import { checkValidatorResult } from "../../../middleware/validators";

export const searchParcoursValidator = [
  param("parcoursId")
    .isInt()
    .withMessage("Id de parcours invalide")
    .notEmpty()
    .withMessage("Id de parcours absent")
    .escape(),
  param("searchValue")
    .isString()
    .withMessage("Valeur de recherche invalide")
    .notEmpty()
    .withMessage("Valeur de recherche absente")
    .escape(),

  checkValidatorResult,
];
