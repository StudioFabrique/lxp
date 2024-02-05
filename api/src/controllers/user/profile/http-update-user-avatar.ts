import fs from "fs";
import { Response } from "express";
import CustomRequest from "../../../utils/interfaces/express/custom-request";
import { serverIssue } from "../../../utils/constantes";
import User from "../../../utils/interfaces/db/user";
import { deleteTempUploadedFile } from "../../../middleware/fileUpload";

export default async function httpUpdateUserAvatar(
  req: CustomRequest,
  res: Response
) {
  try {
    const id = req.auth?.userId;
    const avatarFile: any = req.file;

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
  } catch (error: any) {
    await deleteTempUploadedFile(req);
    let returnedError = error;
    if (error.status === 403) {
      returnedError = { ...returnedError, from: req.socket.remoteAddress };
    }
    return res
      .status(returnedError.status ?? 500)
      .json({ message: returnedError.message ?? serverIssue });
  }
}
