import { type Request, type Response } from "express";
import fs from "fs";
import path from "path";
import { logger } from "../utils/logs/logger.ts";

const deleteFileIfItExists = async (filePath: string) => {
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
};

export default async function httpDeleteInstanceLogo(
  _req: Request,
  res: Response,
) {
  const instanceAssetsPath = path.join(
    import.meta.dirname,
    "..",
    "..",
    "uploads",
    "instance",
  );

  try {
    await Promise.all([
      deleteFileIfItExists(path.join(instanceAssetsPath, "instance-logo.jpeg")),
      deleteFileIfItExists(path.join(instanceAssetsPath, "instance-color.txt")),
    ]);

    return res.json({
      message: "Le logo de l'organisme a bien été supprimé",
    });
  } catch (error) {
    logger.error("Error deleting instance logo:", error);
    return res.status(500).json({
      message: "Le logo de l'organisme n'a pas pu être supprimé.",
    });
  }
}
