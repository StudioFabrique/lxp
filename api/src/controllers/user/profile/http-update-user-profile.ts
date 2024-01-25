import fs from "fs";
import { Response } from "express";
import User, { IUser } from "../../../utils/interfaces/db/user";
import updateUser from "../../../models/user/update-user";
import CustomRequest from "../../../utils/interfaces/express/custom-request";
import { deleteTempUploadedFile } from "../../../middleware/fileUpload";

export default async function httpUpdateUserProfile(
  req: CustomRequest,
  res: Response
) {
  const id = req.auth?.userId;
  const avatarFile: any = req.file;

  if (!id) {
    return res.status(404).json({ message: "non trouvé" });
  }

  const { user }: { user: IUser } = req.body.data;

  if (!!avatarFile) {
    try {
      {
        const string64 = await fs.promises.readFile(avatarFile.path);
        await User.updateOne({ _id: id }, { avatar: string64 });
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
