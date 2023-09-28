import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import postModule from "../../models/formation/post-module";
import fs from "fs";

async function httpPostModule(req: Request, res: Response) {
  const { module, thumb } = req.body;

  const uploadedFile: any = req.file;
  if (uploadedFile !== undefined) {
    try {
      {
        const data = await fs.promises.readFile(uploadedFile.path);
        const base64String = data.toString("base64");
        const response = await postModule(module, thumb, base64String);
        console.log({ response });

        // await fs.promises.unlink(uploadedFile.path);
        console.log("Fichier supprimé :", uploadedFile.path);
        return res
          .status(201)
          .json({ message: "Mise à jour réussie", data: response });
      }
    } catch (error: any) {
      return res
        .status(error.statusCode ?? 500)
        .json({ message: error.message ?? serverIssue });
    }
  }
}

export default httpPostModule;
