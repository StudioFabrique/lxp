import { NextFunction, Response } from "express";
import {
  ValidationChain,
  body,
  param,
  query,
  validationResult,
} from "express-validator";
import { badQuery } from "../utils/constantes";
import { logger } from "../utils/logs/logger";
import CustomRequest from "../utils/interfaces/express/custom-request";
import {
  stringValidateGeneric,
  stringValidateOptional,
} from "../helpers/custom-validators";

export const checkValidatorResult = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const checkValues = validationResult(req);

  if (!checkValues.isEmpty()) {
    const error = {
      message: checkValues.array()[0].msg ?? badQuery,
      from: req.socket.remoteAddress,
      status: 400,
    };
    logger.info(error);
    return res.status(400).json({ message: badQuery });
  }
  next();
};

const customPostalCodeValidation = (value: string) => {
  const postCodePattern = /^\d{5}$/;

  if (
    value === undefined ||
    value === null ||
    value === "" ||
    postCodePattern.test(value)
  ) {
    return true; // Empty value is allowed
  }

  return false; // Run the original validation rules for non-empty value
};

const customPhoneNumberValidation = (value: string) => {
  const phoneNumberPattern = /^\d{10}$/;

  if (
    value === undefined ||
    value === null ||
    value === "" ||
    phoneNumberPattern.test(value)
  ) {
    return true; // Empty value is allowed
  }

  return false; // Run the original validation rules for non-empty value
};

export const userValidator = (isFormData: boolean = false) => {
  const validatorSubject = `${isFormData ? "data.user" : "user"}`;

  const validationChain = [
    body(validatorSubject + ".email")
      .isEmail()
      .trim()
      .withMessage("Email non conforme"),
    body([validatorSubject + ".firstname", validatorSubject + ".lastname"])
      .trim()
      .custom(stringValidateGeneric)
      .withMessage("firstname ou lastname non conforme"),
    body(validatorSubject + ".nickname")
      .trim()
      .custom(stringValidateOptional)
      .withMessage("nickname"),
    body(validatorSubject + ".description")
      .trim()
      .custom(stringValidateOptional)
      .withMessage("description"),
    body(validatorSubject + ".address")
      .trim()
      .custom(stringValidateOptional)
      .withMessage("address"),
    body(validatorSubject + ".city")
      .trim()
      .custom(stringValidateOptional)
      .withMessage("city"),
    body(validatorSubject + ".postCode")
      .optional()
      .custom(customPostalCodeValidation)
      .trim()
      .escape()
      .withMessage("postCode non conforme"),
    body(validatorSubject + ".phoneNumber", "Numéro de téléphone incorrect")
      .optional()
      .isString()
      .trim()
      .escape(),
    body(validatorSubject + ".links.*.url")
      .trim()
      .isString()
      .notEmpty()
      .isURL()
      .withMessage("URL de l'un des objects links incorrect"),
    body(validatorSubject + ".links.*.alias")
      .optional()
      .isString()
      .trim()
      .escape()
      .withMessage("links.*.alias"),
    body(validatorSubject + ".hobbies.*.title")
      .isString()
      .trim()
      .escape()
      .withMessage("hobbies.*.title"),
    body(validatorSubject + ".graduations.*.title")
      .isString()
      .trim()
      .escape()
      .withMessage(".graduations.*.title"),
    body(validatorSubject + ".graduations.*.degree")
      .isString()
      .trim()
      .escape()
      .withMessage(".graduations.*.degree"),

    body([
      validatorSubject + ".hobbies",
      validatorSubject + ".graduations",
      validatorSubject + ".links",
    ])
      .isArray()
      .withMessage("hobbies, graduations ou links non conforme"),
    checkValidatorResult,
  ];

  return validationChain;
};

export const userProfileValidator = (isFormData: boolean = false) => {
  const validatorSubject = `${isFormData ? "data.user" : "user"}`;

  const validationChain = [
    body([validatorSubject + ".firstname", validatorSubject + ".lastname"])
      .exists()
      .notEmpty()
      .isString()
      .trim()
      .escape()
      .withMessage("firstname ou lastname non conforme"),
    body(validatorSubject + ".nickname")
      .optional()
      .isString()
      .trim()
      .escape()
      .withMessage("nickname"),
    body(validatorSubject + ".description")
      .optional()
      .isString()
      .trim()
      .escape()
      .withMessage("description"),
    body(validatorSubject + ".address")
      .optional()
      .isString()
      .trim()
      .escape()
      .withMessage("address"),
    body(validatorSubject + ".city")
      .optional()
      .isString()
      .trim()
      .escape()
      .withMessage("city"),
    body(validatorSubject + ".postCode")
      .optional()
      .custom(customPostalCodeValidation)
      .trim()
      .escape()
      .withMessage("postCode non conforme"),
    body(validatorSubject + ".phoneNumber", "Numéro de téléphone incorrect")
      .optional()
      .isString()
      .trim()
      .escape(),
    body(validatorSubject + ".links.*.url")
      .isString()
      .trim()
      .escape()
      .withMessage("links.*.url"),
    body(validatorSubject + ".links.*.alias")
      .isString()
      .trim()
      .escape()
      .withMessage("links.*.alias"),
    body(validatorSubject + ".hobbies.*.title")
      .isString()
      .trim()
      .escape()
      .withMessage("hobbies.*.title"),
    body(validatorSubject + ".graduations.*.title")
      .isString()
      .trim()
      .escape()
      .withMessage(".graduations.*.title"),
    body(validatorSubject + ".graduations.*.degree")
      .isString()
      .trim()
      .escape()
      .withMessage(".graduations.*.degree"),

    body([
      validatorSubject + ".hobbies",
      validatorSubject + ".graduations",
      validatorSubject + ".links",
    ])
      .isArray()
      .withMessage("hobbies, graduations ou links non conforme"),

    checkValidatorResult,
  ];

  return validationChain;
};

export const manyUsersValidator = [
  body().isArray(),
  body("*.email").isEmail().trim().escape(),
  body(["*.firstname", "*.lastname", "*.nickname", "*.address", "*.city"])
    .isString()
    .toLowerCase()
    .trim()
    .custom(stringValidateOptional)
    .withMessage("description non conforme"),
  body("*.postCode").isPostalCode("FR").trim().escape(),
  body("*.phoneNumber").isString(),
  /* body("*.birthDate").isDate({ format: "dd/mm/yyyy" }).toDate(), */
  checkValidatorResult,
];

// Validator for a group object
// - Name must exist, not be empty, be a string, and match generic string validation
// - Description must be a string (lowercase), optional, and match optional string validation
// - Users field must be an array
// - Each user ID in the users array must be a string
export const groupValidator = [
  body("data.group.name")
    .exists()
    .notEmpty()
    .isString()
    .trim()
    .custom(stringValidateGeneric)
    .withMessage("titre non conforme"),
  body("data.group.desc")
    .optional()
    .isString()
    .toLowerCase()
    .trim()
    .custom(stringValidateOptional)
    .withMessage("description non conforme"),
  body("data.users").isArray().withMessage("users n'est pas un Array"),
  body("data.users.*._id")
    .isString()
    .withMessage("les id du tableau users doivent être de type string"),
  checkValidatorResult,
];

// global validators :

export const getAllValidator = [
  param("role").isString().trim().escape(),
  param("stype").isString().trim().escape(),
  param("sdir").isString().trim().escape(),
  query("page").trim().escape().isInt(),
  query("limit").trim().escape().isInt(),
  checkValidatorResult,
];

export const getAllByRankValidator = [
  param("rank").isString().trim().escape(),
  param("stype").isString().trim().escape(),
  param("sdir").isString().trim().escape(),
  query("page").trim().escape().isInt(),
  query("limit").trim().escape().isInt(),
  checkValidatorResult,
];

export const searchValidator = [
  param("role").isString().trim().escape(),
  param("entity").isString().trim().escape(),
  param("value").isString().trim().escape(),
  param("stype").isString().trim().escape(),
  param("sdir").isString().trim().escape(),
  query("page").trim().escape().isInt(),
  query("limit").trim().escape().isInt(),
  checkValidatorResult,
];

/* add here more validator such as :
    export const classroomValidator = [
        body(...).isSomething(),
        ...,
        body(...).isSomething().isSomethingElse(),
        checkValidatorResult
    ]
*/
