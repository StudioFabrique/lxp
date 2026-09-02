import { type Response, type NextFunction } from "express";
import getSelectParcours from "../../models/parcours/get-select-parcours.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { resolveAccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

export default async function httpGetSelectParcours(
  req: CustomRequest,
  _res: Response,
  next: NextFunction
) {
  try {
    const { formationId } = req.params ?? null;
    const response = await getSelectParcours(
      formationId ? +formationId : null,
      await resolveAccessScope(req.auth!),
    );
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
