import fs from "node:fs";
import { type Response } from "express";
import updateUser from "../../../models/user/update-user.ts";
import type { UserProfileInput } from "../../../models/user/update-user.ts";
import updateUserAvatar from "../../../models/user/update-user-avatar.ts";
import type CustomRequest from "../../../utils/interfaces/express/custom-request.ts";
import { deleteTempUploadedFile } from "../../../middleware/fileUpload.ts";
import { requestEmailChange } from "../../../models/user/change-email.ts";
import { notifyUserUpdated } from "../../../models/user/notify-user-updated.ts";

export default async function httpUpdateUserProfile(
  req: CustomRequest,
  res: Response,
) {
  const id = req.auth?.userId;
  const avatarFile: any = req.file;

  if (!id) {
    return res.status(400).json({ message: "non trouvé" });
  }

  const { user }: { user: UserProfileInput } = req.body.data;

  if (avatarFile) {
    try {
      const string64 = await fs.promises.readFile(avatarFile.path);
      await updateUserAvatar(id, string64);
      await deleteTempUploadedFile(req);
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

    // La photo est enregistrée avant la mise à jour du profil : elle échappe à
    // la comparaison avant/après et se signale à part.
    notifyUserUpdated({
      email: response.email,
      invitationSent: response.invitationSent,
      modifiedBy: "self",
      changes: [
        ...response.changes,
        ...(avatarFile
          ? [{ label: "Photo de profil", value: null }]
          : []),
        ...(emailChangeRequested
          ? [
              {
                label: "Adresse e-mail (en attente de validation)",
                value: String(user.email),
              },
            ]
          : []),
      ],
    });

    return res.status(201).json({
      message: emailChangeRequested
        ? "Profil mis à jour. Un email de validation a été envoyé à la nouvelle adresse."
        : "Utilisateur mis à jour avec succès.",
      data: response.user,
      emailChangeRequested,
    });
  } catch (error: any) {
    return res
      .status(error.statusCode ?? 500)
      .json({ message: error.message ?? "Erreur serveur." });
  }
}
