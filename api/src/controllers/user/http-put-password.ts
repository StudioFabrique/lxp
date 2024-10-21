import putPassword from "../../models/user/put-password";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { Response, NextFunction } from "express";

export default async function httpPutPassword(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.auth?.userId;
    const { password, token } = req.body;
    await putPassword(userId!, password, token);
    const result = {
      statusCode: 200,
      data: { success: true, message: "Mot de passe mis à jour avec succès" },
    };
    next(result);
  } catch (error: any) {
    console.log({ error });
    const err = {
      statusCode: error.statusCode ?? 500,
      message: error.message,
    };
    console.log({ err });
    next(err);
  }
}
