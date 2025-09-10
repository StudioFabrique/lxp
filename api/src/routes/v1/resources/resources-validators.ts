import { body } from "express-validator";
import {
  stringValidateGeneric,
  stringValidateOptional,
} from "../../../helpers/custom-validators";

export const postResourceValidator = [
  body("data.title")
    .isString()
    .withMessage("Le titre de la ressource doit être une chaîne de caractères.")
    .custom(stringValidateGeneric)
    .withMessage("Le titre de la ressource contient des caractères invalides."),
  body("data.description")
    .isString()
    .withMessage(
      "La description de la ressource doit être une chaîne de caractères."
    )
    .custom(stringValidateOptional)
    .withMessage(
      "La description de la ressource contient des caractères non autorisés."
    )
    .optional(),
  body("data.tags")
    .isArray()
    .withMessage("Les tags doivent être contenus dans un tableau."),
  body("data.tags.*")
    .isString()
    .withMessage("Le nom du tag doit être une chaîne de caractères.")
    .custom(stringValidateGeneric)
    .withMessage("Le nom du tag contient des caractères invalides."),
];
