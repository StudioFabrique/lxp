import { Response, NextFunction } from "express";
import CustomRequest from "../utils/interfaces/express/custom-request";
import checkPermissions from "./check-permissions";

const isAdmin = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => checkPermissions("admin", "read")(req, res, next);

export default isAdmin;
