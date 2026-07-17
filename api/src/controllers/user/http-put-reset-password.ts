import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import putResetPassword from "../../models/user/put-reset-password";

export default async function httpPutResetPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const isValid = validationResult(req);

    if (!isValid.isEmpty())
      return res.status(400).json({ errors: isValid.array() });

    const { userId } = req.params;

    await putResetPassword(userId);

    const result = {
      statusCode: 200,
      data: {
        success: true,
        message: "Le mail de réinitialisation a été envoyé avec succès.",
      },
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
