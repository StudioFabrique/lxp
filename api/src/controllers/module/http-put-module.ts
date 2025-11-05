import { Request, Response, NextFunction } from "express";
import fs from "fs";
import sharp from "sharp";

import putModule from "../../models/module/putModule";
import { deleteTempUploadedFile } from "../../middleware/fileUpload";
import { serverIssue } from "../../utils/constantes";
import { validationResult } from "express-validator";

/**
 * Gère la mise à jour d'un module existant
 * Si une image est fournie, elle est redimensionnée et stockée en base64
 * @param req Requête Express contenant les données du module et éventuellement une image
 * @param res Réponse Express
 * @returns Réponse avec le module mis à jour ou message d'erreur
 */
export default async function httpPutModule(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      console.log(result.array());

      return next({
        statusCode: 400,
        message: "Données de validation invalides",
        errors: result.array(),
      });
    }
    // Récupération des données du module et du fichier uploadé
    const module = req.body.module;

    // Mise à jour du module en base de données
    const response = await putModule(module);
    next({
      statusCode: 200,
      data: {
        success: true,
        message: "Module mis à jour avec succès",
        response,
      },
    });
  } catch (error: any) {
    console.log({ error });

    next({
      statusCode: error.statusCode ?? 500,
      message: error.message ?? serverIssue,
    });
  }
}
