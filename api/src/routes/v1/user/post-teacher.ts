import express from "express";
import { body } from "express-validator";

import httpPostTeacher from "../../../controllers/user/http-post-teacher.ts";
import {
  stringValidateGeneric,
  stringValidateOptional,
} from "../../../helpers/custom-validators.ts";
import checkPermissions from "../../../middleware/check-permissions.ts";

const postTeacherRouter = express.Router();

postTeacherRouter.post(
  "/",
  body("email")
    .isEmail()
    .withMessage("L'email saisie n'est pas une adresse email valide."),
  body("firstname")
    .isString()
    .withMessage("Le prénom n'est pas une chaîne de caractères.")
    .custom(stringValidateGeneric)
    .withMessage("Le prénom contient des caractères non autorisés."),
  body("lastname")
    .isString()
    .withMessage("Le nom n'est pas une chaîne de caractères.")
    .custom(stringValidateGeneric)
    .withMessage("Le nom contient des caractères non autorisés."),
  body("nickname")
    .isString()
    .withMessage("Le pseudo doit être une chaîne de caractères.")
    .custom(stringValidateOptional)
    .withMessage("Le pseudo contient des caractères non autorisés.")
    .optional(),
  body("address")
    .isString()
    .withMessage("L'adresse doit être une chaîne de caractères.")
    .custom(stringValidateOptional)
    .withMessage("L'adresse contient des caractères non autorisés.")
    .optional(),
  body("postCode")
    .isString()
    .withMessage("Le code postal doit être une chaîne de caractères.")
    .custom(stringValidateOptional)
    .withMessage("Le code postal contient des caractères non autorisés.")
    .optional(),
  body("city")
    .isString()
    .withMessage("La ville doit être une chaîne de caractères.")
    .custom(stringValidateOptional)
    .withMessage("La ville contient des caractères non autorisés.")
    .optional(),
  body("phoneNumber")
    .isString()
    .withMessage("Le numéro de téléphone doit être une chaîne de caractères.")
    .custom(stringValidateOptional)
    .withMessage(
      "Le numéro de téléphone contient des caractères non autorisés."
    )
    .optional(),
  checkPermissions("user"),
  httpPostTeacher
);

export default postTeacherRouter;
