import { Request, Response } from "express";
import fs from "fs";
import putModuleParcours from "../../models/clone/putModuleParcours";

async function httpPutModuleParcours(req: Request, res: Response) {
  const module = req.body;

  const uploadedFile: any = req.file;

  if (uploadedFile !== undefined) {
    try {
      {
        const data = await fs.promises.readFile(uploadedFile.path);
        const base64String = data.toString("base64");
        const response = await putModuleParcours(module, base64String);
        if (response) {
          await fs.promises.unlink(uploadedFile.path);
          console.log("Fichier supprimé :", uploadedFile.path);
          return res.status(201).json({ message: "Mise à jour réussie" });
        }
      }
    } catch (error: any) {
      return res
        .status(error.statusCode ?? 500)
        .json({ message: error.message });
    }
  }
}

export default httpPutModuleParcours;
