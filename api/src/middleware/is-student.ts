import { Response, NextFunction } from "express";
import CustomRequest from "../utils/interfaces/express/custom-request";
import checkPermissions from "./check-permissions";

const isStudent = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => checkPermissions("student", "read")(req, res, next);

export default isStudent;
