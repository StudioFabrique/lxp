import type { Request, Response } from "express";
import putLessonAvailability from "../../models/lesson/put-lesson-availability.ts";
import { scheduleAvailabilityReconciliation } from "../../services/content-availability-notifications.ts";

async function update(req: Request, res: Response, field: "isPublished" | "visibility") {
  try {
    const result = await putLessonAvailability(Number(req.params.lessonId), {
      [field]: req.body[field],
    });
    scheduleAvailabilityReconciliation();
    return res.status(200).json(result);
  } catch (error) {
    const typed = error as { statusCode?: number; message?: string };
    return res.status(typed.statusCode ?? 500).json({ message: typed.message });
  }
}

export const httpPutLessonPublication = (req: Request, res: Response) =>
  update(req, res, "isPublished");
export const httpPutLessonVisibility = (req: Request, res: Response) =>
  update(req, res, "visibility");
