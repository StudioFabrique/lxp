import express from "express";
import { body } from "express-validator";

import httpPostTeacher from "../../../controllers/user/http-post-teacher";
import {
  isBoolean,
  stringValidateGeneric,
  stringValidateOptional,
} from "../../../helpers/custom-validators";
import checkPermissions from "../../../middleware/check-permissions";

const postTeacherRouter = express.Router();

postTeacherRouter.post(
  "/",
  body("email")
    .trim()
    .notEmpty()
    .withMessage("L'email est obligatoire.")
    .isEmail()
    .withMessage("L'email saisie n'est pas une adresse email valide.")
    .escape(),
  body("firstname")
    .trim()
    .notEmpty()
    .withMessage("Le prénom est obligatoire.")
    .isString()
    .withMessage("Le prénom n'est pas une chaîne de caractères.")
    .custom(stringValidateGeneric)
    .withMessage("Le prénom contient des caractères non autorisés.")
    .escape(),
  body("lastname")
    .trim()
    .notEmpty()
    .withMessage("Le nom est obligatoire.")
    .isString()
    .withMessage("Le nom n'est pas une chaîne de caractères.")
    .custom(stringValidateGeneric)
    .withMessage("Le nom contient des caractères non autorisés.")
    .escape(),
  body("isActive")
    .custom(isBoolean)
    .withMessage("La propriété isActive doit être une valeur booléenne."),
  body("nickname")
    .trim()
    .isString()
    .withMessage("Le pseudo doit être une chaîne de caractères.")
    .custom(stringValidateOptional)
    .withMessage("Le pseudo contient des caractères non autorisés.")
    .escape()
    .optional(),
  body("address")
    .trim()
    .isString()
    .withMessage("L'adresse doit être une chaîne de caractères.")
    .custom(stringValidateOptional)
    .withMessage("L'adresse contient des caractères non autorisés.")
    .escape()
    .optional(),
  body("postCode")
    .trim()
    .isString()
    .withMessage("Le code postal doit être une chaîne de caractères.")
    .custom(stringValidateOptional)
    .withMessage("Le code postal contient des caractères non autorisés.")
    .escape()
    .optional(),
  body("city")
    .trim()
    .isString()
    .withMessage("La ville doit être une chaîne de caractères.")
    .custom(stringValidateOptional)
    .withMessage("La ville contient des caractères non autorisés.")
    .escape()
    .optional(),
  body("phoneNumber")
    .trim()
    .isString()
    .withMessage("Le numéro de téléphone doit être une chaîne de caractères.")
    .custom(stringValidateOptional)
    .withMessage(
      "Le numéro de téléphone contient des caractères non autorisés."
    )
    .escape()
    .optional(),
  checkPermissions("user"),
  httpPostTeacher
);

export default postTeacherRouter;
