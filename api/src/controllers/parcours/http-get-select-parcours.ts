import { Request, Response, NextFunction } from "express";
import getSelectParcours from "../../models/parcours/get-select-parcours";

export default async function httpGetSelectParcours(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const response = await getSelectParcours();
    const result = {
      statusCode: 200,
      data: response,
    };
    next(result);
  } catch (error: any) {
    const err = {
      statusCode: error.statusCode ?? 500,
      message: error.message,
    };
    next(err);
  }
}
