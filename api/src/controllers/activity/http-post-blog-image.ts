import { Request, Response } from "express";

export default async function httpPostBlogImage(req: Request, res: Response) {
  try {
    const uploadedFile = req.file;
    if (!uploadedFile) {
      return res.status(500).json({ message: "no file" });
    }

    return res.status(201).json({
      success: true,
      message: "Image téléversée avec succès",
      response: `/activities/images/${uploadedFile.filename}`,
    });
  } catch (error: any) {
    console.log(error.message);

    return res.status(500).json({ message: error.message });
  }
}
