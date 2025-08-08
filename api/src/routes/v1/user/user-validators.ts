import { body, param } from "express-validator";
import {
  passwordValidateGeneric,
  stringValidateGeneric,
  tokenValidateGeneric,
} from "../../../helpers/custom-validators";
import { checkValidatorResult } from "../../../middleware/validators";

// Validateur pour vérifier le format d'une adresse email
export const postCheckEmailValidator = [
  body("email")
    .notEmpty()
    .withMessage("L'adresse est email est obligatoire")
    .isEmail()
    .withMessage("Adresse email non valide."),
  checkValidatorResult,
];

// Validateur pour vérifier que l'ID utilisateur est un ID MongoDB valide
export const userIdValidator = [
  param("userId")
    .isMongoId()
    .withMessage("L'identifiant de l'utilisateur est invalide."),
  checkValidatorResult,
];

// Validateur pour vérifier le format d'un token d'authentification
export const tokenValidator = [
  body("token").custom(tokenValidateGeneric),
  checkValidatorResult,
];

// Validateur pour vérifier le format du rôle utilisateur lors de la récupération d'utilisateurs par rôle
export const getUsersByRoleValidator = [
  param("role")
    .notEmpty()
    .withMessage("Le rôle est requis.")
    .isString()
    .withMessage("Le rôle doit être une chaîne de caractères.")
    .custom(stringValidateGeneric)
    .withMessage("Le rôle contient des caractères non autorisés."),
  checkValidatorResult,
];

// Valide les données de la requête pour mettre à jour le status de plusieurs utilisateurs, à partir d'un tableau d'identifiants et d'un status boolean
export const updateManyUsersStatusValidator = [
  body("usersIds")
    .isArray()
    .withMessage(
      "Le corps de la requête doit contenir un tableau d'identifiants."
    ),
  body("usersIds.*")
    .isMongoId()
    .withMessage(
      "Chaque élément de usersIds doit être une chaîne de caractères."
    ),
  body("status")
    .isString()
    .withMessage("Le status doit être une chaine de caractères.")
    .custom((value) => {
      const validStatuses = ["actif", "inactif"];
      if (!validStatuses.includes(value)) {
        throw new Error("Le status doit être 'actif' ou 'inactif'.");
      }
      return true;
    }),
];

// Mettre à jour le status d'un utilisateur
export const updateUserStatusValidator = [
  body("userId")
    .isMongoId()
    .withMessage("L'identifiant de l'utilisateur est invalide."),
  body("value")
    .isBoolean()
    .withMessage("Le status doit être une valeur booleenne."),
];

// Validateur pour vérifier le format du token et du mot de passe lors d'une modification de mot de passe
export const postPasswordValidator = [
  body("token")
    .custom(tokenValidateGeneric)
    .withMessage("Le token contient des caractères non autorisés."),
  body("password")
    .custom(passwordValidateGeneric)
    .withMessage("Le mot de passe n'est pas valide."),
  checkValidatorResult,
];
