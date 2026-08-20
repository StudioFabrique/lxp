import { type Request, type Response } from "express";
import type { IGroup } from "../../utils/interfaces/db/group.ts";
import { creationSuccessfull, serverIssue } from "../../utils/constantes.ts";
import { deleteTempUploadedFile } from "../../middleware/fileUpload.ts";
import fs from "fs";
import putGroup from "../../models/group/put-group.ts";
import type { IUser } from "../../utils/interfaces/db/user.ts";

export default async function httpPutGroup(req: Request, res: Response) {
  const { id } = req.params;

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

    await putGroup(id, group, users, image, parcoursId);

    await deleteTempUploadedFile(req);
    return res.status(201).json({ message: creationSuccessfull });
  } catch (error: any) {
    await deleteTempUploadedFile(req);

    // Même distinction qu'à la création : un conflit de nom ou un groupe
    // introuvable est une réponse, pas une panne. La modification renvoyait
    // 201 dans les deux cas, l'interface annonçait donc un succès.
    if (error?.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(500).json({ message: serverIssue });
  }
}
