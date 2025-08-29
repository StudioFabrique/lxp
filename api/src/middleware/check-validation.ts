import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

const checkValidation = (validator: any) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw { statusCode: 400, message: "Bad Request", errors: errors.array() };
    }
    next();
  };
};

export default checkValidation;
