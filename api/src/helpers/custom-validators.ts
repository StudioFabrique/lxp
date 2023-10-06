import { body } from "express-validator";
import { regexGeneric, regexOptionalGeneric } from "../utils/constantes";
import { checkValidatorResult } from "../middleware/validators";

export function stringValidateOptional(value: string) {
  return regexOptionalGeneric.test(value);
}

export function stringValidateGeneric(value: string) {
  return regexGeneric.test(value);
}

export const idsArrayValidator = [
  body().isArray().withMessage("Un tableau de nombres entiers est requis"),
  body("*")
    .isNumeric()
    .withMessage("Les identifiant doivent être des valeurs numériques"),
  checkValidatorResult,
];

export const virtualClassValidator = [
  body("virtualClass")
    .isURL()
    .withMessage("Url non valide")
    .notEmpty()
    .withMessage("Url absente"),
  checkValidatorResult,
];
