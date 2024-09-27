import CustomRequest from "../../utils/interfaces/express/custom-request";
import { Response, NextFunction } from "express";

export default async function httpPutPassword(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    return res.json(req.body.token);
  } catch (error: any) {
    console.log(error);
  }
}
