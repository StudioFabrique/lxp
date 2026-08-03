import { type Response, type NextFunction } from "express";
import type CustomRequest from "../utils/interfaces/express/custom-request.ts";
import checkPermissions from "./check-permissions.ts";

const isStudent = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => checkPermissions("student", "read")(req, res, next);

export default isStudent;
