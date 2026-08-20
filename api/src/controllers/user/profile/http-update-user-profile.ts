import fs from "fs";
import { type Response } from "express";
import type { IUser } from "../../../utils/interfaces/db/user.ts";
import updateUser from "../../../models/user/update-user.ts";
import updateUserAvatar from "../../../models/user/update-user-avatar.ts";
import type CustomRequest from "../../../utils/interfaces/express/custom-request.ts";
import { deleteTempUploadedFile } from "../../../middleware/fileUpload.ts";

export default async function httpUpdateUserProfile(
  req: CustomRequest,
  res: Response
) {
  const id = req.auth?.userId;
  const avatarFile: any = req.file;

  if (!id) {
    return res.status(400).json({ message: "non trouvé" });
  }

  const { user }: { user: IUser } = req.body.data;

  if (!!avatarFile) {
    try {
      {
        const string64 = await fs.promises.readFile(avatarFile.path);
        await updateUserAvatar(id, string64);
        await deleteTempUploadedFile(req);
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  try {
    const response = await updateUser(id, user);

    if (!response) {
      return res.status(404).json({ message: "non trouvé" });
    }

    return res
      .status(201)
      .json({ message: "utilisateur mis à jour avec succès", data: response });
  } catch (error) {
    return res.status(500).json({ message: "erreur serveur" });
  }
}
