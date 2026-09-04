import fs from "fs";
import { type Response } from "express";
import type { IUser } from "../../../utils/interfaces/db/user.ts";
import updateUser from "../../../models/user/update-user.ts";
import updateUserAvatar from "../../../models/user/update-user-avatar.ts";
import type CustomRequest from "../../../utils/interfaces/express/custom-request.ts";
import { deleteTempUploadedFile } from "../../../middleware/fileUpload.ts";
import { requestEmailChange } from "../../../models/user/change-email.ts";

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

    const emailChangeRequested = await requestEmailChange(id, user.email);

    return res.status(201).json({
      message: emailChangeRequested
        ? "Profil mis à jour. Un email de validation a été envoyé à la nouvelle adresse."
        : "Utilisateur mis à jour avec succès.",
      data: response,
      emailChangeRequested,
    });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? "Erreur serveur." });
  }
}
