import { Request, Response, NextFunction } from "express";
import putResetPassword from "../../models/user/put-reset-password";
import User from "../../utils/interfaces/db/user";

export default async function httpPutResetPasswordEmail(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser)
      throw { statusCode: 404, message: "L'utilisateur n'existe pas." };

    await putResetPassword(existingUser._id.toString());

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
