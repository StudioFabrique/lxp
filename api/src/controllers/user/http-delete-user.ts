import { type Response, type NextFunction } from "express";
import { badQuery } from "../../utils/constantes.ts";
import deleteUser from "../../models/user/delete-user.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

export default async function httpDeleteUser(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
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
    const isExpectedError = typeof error?.statusCode === "number";

    next({
      statusCode: isExpectedError ? error.statusCode : 500,
      message: isExpectedError
        ? error.message
        : "Une erreur est survenue lors de la suppression de l'utilisateur.",
    });
  }
}
