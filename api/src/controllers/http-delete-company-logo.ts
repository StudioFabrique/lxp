import { type Request, type Response } from "express";
import fs from "fs";
import path from "path";

const deleteFileIfItExists = async (filePath: string) => {
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
};

export default async function httpDeleteCompanyLogo(
  _req: Request,
  res: Response,
) {
  const companyAssetsPath = path.join(
    import.meta.dirname,
    "..",
    "..",
    "uploads",
    "company",
  );

  try {
    await Promise.all([
      deleteFileIfItExists(path.join(companyAssetsPath, "company-logo.jpeg")),
      deleteFileIfItExists(path.join(companyAssetsPath, "company-color.txt")),
    ]);

    return res.json({
      message: "Le logo de l'organisme a bien été supprimé",
    });
  } catch (error) {
    console.error("Error deleting company logo:", error);
    return res.status(500).json({
      message: "Le logo de l'organisme n'a pas pu être supprimé.",
    });
  }
}
