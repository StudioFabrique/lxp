import { body } from "express-validator";
import { checkValidatorResult } from "../../../middleware/validators";
import {
  rgbaValidator,
  stringValidateGeneric,
} from "../../../helpers/custom-validators";

export const postManyTagsValidator = [
  // Valider le champ 'tableau'
  body("tags")
    .isArray()
    .withMessage('Le champ "tags" doit être un tableau')
    .custom((tags: any[]) => {
      // Vérifier si chaque élément du tableau est un objet avec les champs 'name' et 'color'
      for (const item of tags) {
        if (
          typeof item !== "object" ||
          !("name" in item) ||
          !("color" in item)
        ) {
          throw new Error(
            'Chaque élément du tableau doit être un objet avec les champs "name" et "color"'
          );
        }
      }
      return true;
    }),
  body("tags.*.name")
    .notEmpty()
    .withMessage("Le nom du tag est obligatoire.")
    .custom(stringValidateGeneric)
    .withMessage("Le nom d'un tag contient des caractères non autorisés."),
  body("tags.*.color")
    .notEmpty()
    .withMessage("La couleur du tag est obligatoire.")
    .custom(rgbaValidator)
    .withMessage("Une couleur d'un tag contient des caractères non autorisés."),
  checkValidatorResult,
];
