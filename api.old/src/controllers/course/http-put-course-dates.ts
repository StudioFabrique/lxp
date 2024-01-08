import { Request, Response } from "express";

import putCourseDates from "../../models/course/put-course-dates";

async function httpPutCourseDates(req: Request, res: Response) {
  const { courseId } = req.params;
  const { minDate, maxDate, synchroneDuration, asynchroneDuration, id } =
    req.body;

  try {
    await putCourseDates(
      +courseId,
      minDate,
      maxDate,
      +synchroneDuration,
      +asynchroneDuration,
      +id
    );
    return res
      .status(201)
      .json({ success: true, message: "Plage de dates ajoutée avec succès" });
  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      message: error.statusCode !== 500 ? error.message : error.message,
    });
  }
}

export default httpPutCourseDates;
