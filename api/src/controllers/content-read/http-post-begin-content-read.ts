import { type Response } from "express";
import { serverIssue } from "../../utils/constantes.ts";
import postBeginContentRead from "../../models/content-read/post-begin-content-read.ts";
import type { ContentType } from "../../config/content-read.ts";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";

export default async function httpPostBeginContentRead(
  req: CustomRequest,
  res: Response,
) {
  const userId = req.auth?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Session absente ou expirée" });
  }

  try {
    const { type, id } = req.params;

    const contentRead = await postBeginContentRead(
      type as ContentType,
      Number(id),
      userId,
    );

    // Un formateur ou un administrateur consulte le contenu sans être suivi :
    // ce n'est pas une erreur, il n'y a simplement rien à enregistrer.
    if (!contentRead) {
      return res.status(204).send();
    }

    return res.status(201).json({ id: contentRead.id });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? serverIssue });
  }
}
