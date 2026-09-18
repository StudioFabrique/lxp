import type { Request, Response } from "express";
import putParcoursVisibility from "../../models/parcours/put-parcours-visibility.ts";
import { scheduleAvailabilityReconciliation } from "../../services/content-availability-notifications.ts";

export default async function httpPutParcoursVisibility(req: Request, res: Response) {
  try {
    const result = await putParcoursVisibility(
      Number(req.params.parcoursId),
      req.body.visibility,
    );
    scheduleAvailabilityReconciliation();
    return res.status(200).json(result);
  } catch (error) {
    const typed = error as { statusCode?: number; message?: string };
    return res.status(typed.statusCode ?? 500).json({ message: typed.message });
  }
}
