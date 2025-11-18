import { Request, Response, NextFunction } from "express";
import getSelectParcours from "../../models/parcours/get-select-parcours";

export default async function httpGetSelectParcours(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const { formationId } = req.params ?? null;
    const response = await getSelectParcours(formationId ? +formationId : null);
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
