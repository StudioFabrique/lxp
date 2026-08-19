import { type Request, type Response, type NextFunction } from "express";
import { putResetPasswordByEmail } from "../../models/user/put-reset-password.ts";

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
        message:
          "Si un compte est associé à cette adresse email, vous allez recevoir un lien de réinitialisation.",
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
