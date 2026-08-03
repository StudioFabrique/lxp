import { body } from "express-validator";
import { checkValidatorResult } from "../../../middleware/validators.ts";
import { stringValidateGeneric } from "../../../helpers/custom-validators.ts";

export const putObjectiveValidator = [
  body("id").isNumeric().notEmpty().escape(),
  body("description")
    .isString()
    .notEmpty()
    .withMessage("La description de l'bojectif est requise.")
    .custom(stringValidateGeneric)
    .withMessage(
      "La description de l'objectif contient des caractères non autorisés."
    ),
  checkValidatorResult,
];
