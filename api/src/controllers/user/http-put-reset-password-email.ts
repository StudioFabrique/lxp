import { Request, Response, NextFunction } from "express";
import { putResetPasswordByEmail } from "../../models/user/put-reset-password";

export default async function httpPutResetPasswordEmail(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const { email } = req.body;

    await putResetPasswordByEmail(email);

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
