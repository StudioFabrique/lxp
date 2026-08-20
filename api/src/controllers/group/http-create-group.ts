import { type Request, type Response } from "express";
import type { IGroup } from "../../utils/interfaces/db/group.ts";
import createGroup from "../../models/group/create-group.ts";
import { creationSuccessfull, serverIssue } from "../../utils/constantes.ts";
import { deleteTempUploadedFile } from "../../middleware/fileUpload.ts";
import fs from "fs";
import type { IUser } from "../../utils/interfaces/db/user.ts";

export default async function httpCreateGroup(req: Request, res: Response) {
  const uploadedFile = req.file;

  const {
    group,
    users,
    parcoursId,
  }: {
    group: IGroup;
    users: IUser[];
    parcoursId?: number;
  } = req.body.data;

  let image: any;

  try {
    if (!!uploadedFile) {
      image = await fs.promises.readFile(uploadedFile.path);
    }
    await createGroup(group, users, image, parcoursId);

    await deleteTempUploadedFile(req);
    return res.status(201).json({ message: creationSuccessfull });
  } catch (error: any) {
    await deleteTempUploadedFile(req);

    // Le modèle qualifie les refus attendus (nom déjà pris, nom vide) : ils
    // portent leur propre statut et un message destiné à l'utilisateur. Le
    // reste est un incident serveur et ne doit pas fuiter de détail technique.
    if (error?.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(500).json({ message: serverIssue });
  }
}
