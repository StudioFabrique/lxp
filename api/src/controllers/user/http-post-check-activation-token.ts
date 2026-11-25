import { type Response, type NextFunction } from "express";
import { getActivationLinkUser } from "../../models/user/get-activation-link-user.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

export default async function httpPostCheckActivationToken(
  req: CustomRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const user = await getActivationLinkUser(req.auth?.userId);
    if (!user) {
      return next({ statusCode: 401, message: "Ce lien n'est plus valide." });
    }
    const result = {
      statusCode: 200,
      data: {
        success: true,
        message: "Lien valide.",
        email: user.email,
        roleLabel: user.roleLabel,
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
