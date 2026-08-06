import { type NextFunction, type Request, type Response } from "express";
import { validationResult } from "express-validator";
import { badQuery } from "../utils/constantes.ts";

const checkValidation = (validator: any) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw { statusCode: 400, message: badQuery, errors: errors.array() };
    }
    next();
  };
};

export default checkValidation;
