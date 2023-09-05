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
    logger.error(error);
    return res.status(400).json({ message: badQuery });
  }
  next();
};

const customEmptyValueValidation = (field: ValidationChain) => {
  return (value: any, { req }: { req: any }) => {
    if (value === undefined || value === null || value === "") {
      return true; // Empty value is allowed
    }

    return field.run(req); // Run the original validation rules for non-empty value
  };
};

export const userValidator = [
  body("email").exists().isEmail().trim().escape(),
  body(["firstname", "lastname"])
    .exists()
    .notEmpty()
    .isString()
    .trim()
    .escape(),
  body([
    "nickname",
    "description",
    "address",
    "city",
    "links.*.url",
    "links.*.alias",
    "hobbies.*.title",
    "graduations.*.title",
    "graduations.*.degree",
  ])
    .custom(customEmptyValueValidation(body().isString().trim().escape()))
    .trim()
    .escape(),
  body("userType").exists().notEmpty().isNumeric(),
  body("postCode")
    .custom(
      customEmptyValueValidation(body().isPostalCode("FR").trim().escape())
    )
    .trim()
    .escape(),
  // body("roles").isArray(),
  body(["graduations.*.date", "birthDate"]).custom(
    customEmptyValueValidation(body().isDate().trim().escape())
  ),
  body(["hobbies", "graduations", "links"]).isArray(),
  checkValidatorResult,
];

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
  body("name", "desc").isString().trim().escape(),
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
