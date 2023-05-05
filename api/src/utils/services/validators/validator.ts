import { NextFunction, Request, Response } from "express";
import { ValidationChain, body, check } from "express-validator";
import userArrayValidator from "./user/userArrayValidator.json";
import { ValidationTypeAllow } from "./validationTypeAllow";

const validator = (req: Request, res: Response, next: NextFunction) => {
  console.log("debut fonction");

  const body = req.body;
  console.log({ body });

  const arrayValidator: { name: string; type: ValidationTypeAllow }[] =
    userArrayValidator as { name: string; type: ValidationTypeAllow }[];

  arrayValidator.map((userField) =>
    _validator(check(body[userField.name]), userField.type)
  );
  next();
};

const _validator = (
  check: ValidationChain,
  validorField: ValidationTypeAllow
) => {
  check[validorField]().trim().escape();
};

export default validator;
