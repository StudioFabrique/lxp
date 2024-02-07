import { body } from "express-validator";
import { checkValidatorResult } from "../../../middleware/validators";
import { stringValidateGeneric } from "../../../helpers/custom-validators";

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
  body("*.name")
    .notEmpty()
    .withMessage("Le nom du tag est obligatoire.")
    .custom(stringValidateGeneric),
  body("*.color").notEmpty().withMessage("La couleur du tag est obligatoire."),
  checkValidatorResult,
];
