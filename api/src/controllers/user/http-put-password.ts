import { validationResult } from "express-validator";
import putPassword from "../../models/user/put-password.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { type Response, type NextFunction } from "express";

export default async function httpPutPassword(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const isValid = validationResult(req);

    if (!isValid.isEmpty())
      return res.status(400).json({ errors: isValid.array() });

    const userId = req.auth?.userId;
    const { password, token } = req.body;

    await putPassword(userId!, password, token);
    const result = {
      statusCode: 200,
      data: { success: true, message: "Mot de passe mis à jour avec succès" },
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
