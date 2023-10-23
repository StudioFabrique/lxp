import { Request, Response } from "express";
import putCourseDates from "../../models/course/put-course-dates";

async function httpPutCourseDates(req: Request, res: Response) {
  const { courseId } = req.params;
  const { minDate, maxDate, synchroneDuration, asynchroneDuration } = req.body;
  console.log(req.body);

  try {
    const response = await putCourseDates(
      +courseId,
      minDate,
      maxDate,
      +synchroneDuration,
      +asynchroneDuration
    );
    return res.status(201).json(response);
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message: error.statusCode !== 500 ? error.message : error.message,
    });
  }
}

export default httpPutCourseDates;
