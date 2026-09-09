import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/db.ts";
import { defaultCourseDates } from "../../models/course/course-calendar-dates.ts";

// Idempotent : un cours retiré volontairement ne sera jamais réinitialisé.
export async function httpInitializeCourseCalendar(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const courses = await prisma.$transaction(async (tx) => {
      const module = await tx.module.findUnique({
        where: { id: Number(req.params.moduleId) },
        include: {
          courses: { orderBy: [{ order: "asc" }, { id: "asc" }] },
        },
      });
      if (!module) return null;
      for (const [index, course] of module.courses.entries()) {
        if (course.calendarInitialized) continue;
        await tx.course.updateMany({
          // Le prédicat évite qu'une ouverture concurrente écrase un calendrier.
          where: { id: course.id, calendarInitialized: false },
          data: {
            calendarInitialized: true,
            ...(course.dates.length === 0
              ? {
                  dates: [
                    defaultCourseDates(
                      index,
                      module.courses.length,
                      module.minDate,
                      module.maxDate,
                    ),
                  ],
                }
              : {}),
          },
        });
      }
      return tx.course.findMany({
        where: { moduleId: module.id },
        orderBy: [{ order: "asc" }, { id: "asc" }],
        select: { id: true, dates: true },
      });
    });
    if (!courses) {
      return res.status(404).json({ message: "Module introuvable" });
    }
    return res.json(courses);
  } catch (error) {
    next(error);
  }
}

export async function httpReplaceCourseCalendarDates(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const course = await prisma.course.update({
      where: { id: Number(req.params.courseId) },
      data: { dates: req.body.dates, calendarInitialized: true },
      select: { id: true, dates: true },
    });
    return res.json(course);
  } catch (error) {
    next(error);
  }
}
