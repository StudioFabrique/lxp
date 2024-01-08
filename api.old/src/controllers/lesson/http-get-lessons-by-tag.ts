import { Request, Response } from "express";
import getLessonsByTag from "../../models/lesson/get-lessons-by-tag";

async function httpGetLessonsByTag(req: Request, res: Response) {
  const { tagId } = req.params;

  try {
    const response = await getLessonsByTag(+tagId);
    return res.status(200).json({ total: response.length, data: response });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message: error.statusCode !== 500 ? error.message : error.message,
    });
  }
}

export default httpGetLessonsByTag;
