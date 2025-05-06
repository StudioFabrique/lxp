import { Response, NextFunction } from "express";
import { badQuery } from "../../utils/constantes";
import deleteUser from "../../models/user/delete-user";
import CustomRequest from "../../utils/interfaces/express/custom-request";
import { stat } from "fs";

export default async function httpDeleteUser(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  const userId = req.auth?.userId;

  if (!id || !userId) {
    return res.status(400).json({ message: badQuery });
  }

  try {
    await deleteUser(id, userId);

    next({
      statusCode: 200,
      data: {
        success: true,
        message: "L'utilisateur a été supprimé avec succès",
      },
    });
  } catch (error: any) {
    console.log({ error });

    next({
      statusCode: error.statusCode ?? 500,
      message:
        error.message ?? "Erreur lors de la suppression de l'utilisateur",
    });
  }
}
