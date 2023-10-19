import { Request, Response } from "express";

import putLesson from "../../models/lesson/put-lesson";

async function httpPutLesson(req: Request, res: Response) {
  const lesson = req.body;

  try {
    const response = await putLesson(lesson);
    return res.status(201).json(response);
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message: error.statusCode !== 500 ? error.message : error.message,
    });
  }
}

export default httpPutLesson;
