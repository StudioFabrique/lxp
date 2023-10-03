import { Request, Response } from "express";
import { serverIssue } from "../../utils/constantes";
import fs from "fs";
import putCourseImage from "../../models/course/put-course-image";

async function httpPutCourseImage(req: Request, res: Response) {
  const uploadedFile: any = req.file;
  const courseId = +req.body.courseId;
  try {
    if (uploadedFile !== undefined) {
      try {
        {
          const data = await fs.promises.readFile(uploadedFile.path);
          const base64String = data.toString("base64");
          const response = await putCourseImage(+courseId, base64String);
          if (response) {
            await fs.promises.unlink(uploadedFile.path);
            console.log("Fichier supprimé :", uploadedFile.path);
            return res
              .status(201)
              .json({ message: "Image du cours mise à jour" });
          }
        }
      } catch (error: any) {
        return res
          .status(500)
          .json({ error: "Erreur lors de la lecture du fichier." });
      }
    }
  } catch (error: any) {
    return res.status(error.statusCode).json({
      message: error.statusCode !== 500 ? error.message : serverIssue,
    });
  }
}

export default httpPutCourseImage;
