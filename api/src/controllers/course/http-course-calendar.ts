import type { Request, Response, NextFunction } from "express";
import {
  initializeCourseCalendar,
  replaceCourseCalendarDates,
  replaceCourseCalendarColor,
} from "../../models/course/course-calendar.ts";

export async function httpInitializeCourseCalendar(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const courses = await initializeCourseCalendar(Number(req.params.moduleId));
    if (!courses) {
      return res.status(404).json({ message: "Module introuvable" });
    }
    return res.json(courses);
  } catch (error) {
    next(error);
  }
}

export async function httpReplaceCourseCalendarColor(req: Request, res: Response, next: NextFunction) {
  try {
    return res.json(await replaceCourseCalendarColor(Number(req.params.courseId), req.body.calendarColor));
  } catch (error) { next(error); }
}

export async function httpReplaceCourseCalendarDates(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const course = await replaceCourseCalendarDates(
      Number(req.params.courseId),
      req.body.dates,
    );
    return res.json(course);
  } catch (error) {
    next(error);
  }
}
