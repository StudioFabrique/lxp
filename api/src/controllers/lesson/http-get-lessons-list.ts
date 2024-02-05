import { Request, Response } from "express";
import getLessonsList from "../../models/lesson/get-lessons-list";

export default async function httpGetLessonsList(req: Request, res: Response) {
  try {
    const response = await getLessonsList();
    return res.status(200).json({
      success: true,
      message:
        response.length === 0 ? "Aucune leçons trouvées" : "Liste téléchargée",
      lessons: response,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
