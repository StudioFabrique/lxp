import { param } from "express-validator";
import { checkValidatorResult } from "../../../middleware/validators";

export const getModulesFromParcoursValidator = [
  param("parcoursId")
    .isNumeric()
    .withMessage("Identifiant de parcours non valide")
    .notEmpty()
    .withMessage("Un identifiant de parcours est requise")
    .trim()
    .escape(),
  checkValidatorResult,
];
