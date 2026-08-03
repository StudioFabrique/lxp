import { type Request, type Response } from "express";
import deleteCourseDates from "../../models/course/delete-course-dates.ts";

async function httpDeleteCourseDates(req: Request, res: Response) {
  const { courseId, datesId } = req.params;

  try {
    await deleteCourseDates(+courseId, +datesId);
    return res
      .status(201)
      .json({ success: true, message: "Dates effacées avec succès" });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message: error.statusCode !== 500 ? error.message : error.message,
    });
  }
}

export default httpDeleteCourseDates;
