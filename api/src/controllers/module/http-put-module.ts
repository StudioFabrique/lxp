import { Request, Response } from "express";
import fs from "fs";

import putModule from "../../models/module/putModule";

async function httpPutModule(req: Request, res: Response) {
  const { thumb } = req.body;
  const module = JSON.parse(req.body.module);

  const uploadedFile: any = req.file;

  try {
    let base64String: string | undefined;
    {
      if (uploadedFile !== undefined) {
        const data = await fs.promises.readFile(uploadedFile.path);
        base64String = data.toString("base64");
      } else {
        base64String = undefined;
      }

      const response = await putModule(module, thumb, base64String);
      console.log({ response });

      if (uploadedFile !== undefined) {
        await fs.promises.unlink(uploadedFile.path);
        console.log("Fichier supprimé :", uploadedFile.path);
      }

      return res
        .status(201)
        .json({ message: "Mise à jour réussie", data: response });
    }
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
}

export default httpPutModule;
