import type { Request, Response } from "express";
import putLessonAvailability from "../../models/lesson/put-lesson-availability.ts";
import { scheduleAvailabilityReconciliation } from "../../services/content-availability-notifications.ts";

async function update(req: Request, res: Response) {
  try {
    const result = await putLessonAvailability(Number(req.params.lessonId), {
      visibility: req.body.visibility,
    });
    scheduleAvailabilityReconciliation();
    return res.status(200).json(result);
  } catch (error) {
    const typed = error as { statusCode?: number; message?: string };
    return res.status(typed.statusCode ?? 500).json({ message: typed.message });
  }
}

export const httpPutLessonVisibility = (req: Request, res: Response) =>
  update(req, res);
