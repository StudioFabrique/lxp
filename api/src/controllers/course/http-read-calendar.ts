import type { NextFunction, Response } from "express";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import { resolveAccessScope } from "../../utils/services/permissions/accessible-parcours.ts";
import { getCalendarParcours, getParcoursCalendar } from "../../models/course/get-read-calendar.ts";

export async function httpGetCalendarParcours(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    return res.json(await getCalendarParcours(await resolveAccessScope(req.auth!)));
  } catch (error) { next(error); }
}

export async function httpGetParcoursCalendar(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const scope = await resolveAccessScope(req.auth!);
    const calendar = await getParcoursCalendar(
      Number(req.params.parcoursId),
      scope,
      scope?.kind === "learner" ? req.auth!.userId : undefined,
    );
    if (!calendar) return res.status(404).json({ message: "Parcours introuvable" });
    return res.json(calendar);
  } catch (error) { next(error); }
}
