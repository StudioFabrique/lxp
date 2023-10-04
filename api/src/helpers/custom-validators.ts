import { body } from "express-validator";
import { regexGeneric, regexOptionalGeneric } from "../utils/constantes";
import { checkValidatorResult } from "../middleware/validators";

export function titleValidate(value: string) {
  return regexGeneric.test(value);
}

export function descriptionValidateOptional(value: string) {
  return regexOptionalGeneric.test(value);
}

export const idsArrayValidator = [
  body().isArray().withMessage("Un tableau de nombres entiers est requis"),
  body("*")
    .isNumeric()
    .withMessage("Les identifiant doivent être des valeurs numériques"),
  checkValidatorResult,
];
