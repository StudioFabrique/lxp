import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { badQuery } from "../utils/constantes";

const checkValidatorResult = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const checkValues = validationResult(req);

  if (!checkValues.isEmpty()) {
    console.log(checkValues.array());
    return res.status(400).json({ message: badQuery });
  }
  next();
};

export const userValidator = [
  body("email").isEmail().trim().escape(),
  body("password").isString().trim().escape(),
  body("firstname").isString().trim().escape(),
  body("lastname").isString().trim().escape(),
  body("address").isString().trim().escape(),
  body("postCode").isPostalCode("FR").trim().escape(),
  body("city").isString().trim().escape(),
  //   body("roles").isArray(),
  checkValidatorResult,
];

/* add here more validator such as :
    export const classroomValidator = [
        body(...),
        ...,
        body(...),
        checkValidatorResult
    ] 
*/
