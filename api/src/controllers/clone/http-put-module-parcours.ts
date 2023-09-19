import { Request, Response } from "express";
import fs from "fs";
import putModuleParcours from "../../models/clone/putModuleParcours";

async function httpPutModuleParcours(req: Request, res: Response) {
  const { module, thumb } = req.body;
  console.log(req.body);

  const uploadedFile: any = req.file;

  if (uploadedFile !== undefined) {
    try {
      {
        const data = await fs.promises.readFile(uploadedFile.path);
        const base64String = data.toString("base64");
        const response = await putModuleParcours(module, thumb, base64String);
        console.log({ response });

        if (response !== false) {
          await fs.promises.unlink(uploadedFile.path);
          console.log("Fichier supprimé :", uploadedFile.path);
          return res
            .status(201)
            .json({ message: "Mise à jour réussie", data: response });
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
