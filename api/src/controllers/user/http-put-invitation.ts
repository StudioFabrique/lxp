/**
Envoi d'un email d'activation et mise à jour
de la propriété "invitationSent" si l'envoi a réussi.
*/

import { Request, Response, NextFunction } from "express";
import putInvitation from "../../models/user/put-invitation";

export default async function httpPutInvitation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = req.params;
    await putInvitation(userId);
    const result = {
      statusCode: 200,
      data: {
        success: true,
        message: "L'invitation a bien été envoyée.",
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
