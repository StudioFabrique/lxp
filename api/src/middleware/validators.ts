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

export const userValidator = (extraValidationChain?: ValidationChain) => {
  const validationChain = [
    body("user.email")
      .exists()
      .isEmail()
      .trim()
      .escape()
      .withMessage("email non conforme"),
    body(["user.firstname", "user.lastname"])
      .exists()
      .notEmpty()
      .isString()
      .trim()
      .escape()
      .withMessage("firstname ou lastname non conforme"),
    body([
      "user.nickname",
      "user.description",
      "user.address",
      "user.city",
      "user.phoneNumber",
      "user.links.*.url",
      "user.links.*.alias",
      "user.hobbies.*.title",
      "user.graduations.*.title",
      "user.graduations.*.degree",
    ])
      .isString()
      .trim()
      .escape()
      .withMessage(
        "nickname, description, address, city, links, hobbies ou graduations non conforme"
      ),
    body("user.postCode")
      .custom(customPostalCodeValidation)
      .trim()
      .escape()
      .withMessage("postCode non conforme"),
    body(["user.hobbies", "user.graduations", "user.links"])
      .isArray()
      .withMessage("hobbies, graduations ou links non conforme"),
    // Include the extraValidationChain if provided
    ...(extraValidationChain ? [extraValidationChain] : []),
    checkValidatorResult,
  ];

  return validationChain;
};

export const manyUsersValidator = [
  body().isArray(),
  body("*.email").isEmail().trim().escape(),
  body(["*.firstname", "*.lastname", "*.nickname", "*.address", "*.city"])
    .isString()
    .trim()
    .escape(),
  body("*.postCode").isPostalCode("FR").trim().escape(),
  body("*.phoneNumber").isNumeric(),
  /* body("*.birthDate").isDate({ format: "dd/mm/yyyy" }).toDate(), */
  checkValidatorResult,
];

export const groupValidator = [
  body(["data.group.name", "data.group.desc"])
    .exists()
    .notEmpty()
    .isString()
    .trim()
    .escape()
    .withMessage("titre (name) ou description (desc) non conforme"),
  body([
    "data.users.*.email",
    "data.users.*.firstname",
    "data.users.*.lastname",
  ])
    .notEmpty()
    .isString()
    .trim()
    .escape()
    .withMessage("champs dans users non valides"),
  body("data.users").isArray().withMessage("users n'est pas un Array"),
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
