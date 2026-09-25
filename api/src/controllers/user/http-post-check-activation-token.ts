import { type Response, type NextFunction } from "express";
import User from "../../utils/interfaces/db/user.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

export default async function httpPostCheckActivationToken(
  req: CustomRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const user = await User.findById(req.auth?.userId).select("email");
    if (!user) {
      return next({ statusCode: 401, message: "Ce lien n'est plus valide." });
    }
    const result = {
      statusCode: 200,
      data: {
        success: true,
        message: "Lien valide.",
        email: user.email,
      },
    };
    next(result);
  } catch (error: any) {
    const err = {
      statusCode: 500,
      message: error.message,
    };
    next(err);
  }
}
