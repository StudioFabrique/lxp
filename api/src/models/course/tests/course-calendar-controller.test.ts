import { jest } from "@jest/globals";
import type { Request, Response, NextFunction } from "express";

const courses = [
  { id: 1, calendarInitialized: false, dates: [] as object[] },
  { id: 2, calendarInitialized: true, dates: [] as object[] },
  { id: 3, calendarInitialized: false, dates: [{ id: 8, minDate: "2026-10-01", maxDate: "2026-10-10" }] },
];
const tx = {
  module: { findUnique: jest.fn<() => Promise<unknown>>() },
  course: {
    updateMany: jest.fn<() => Promise<unknown>>().mockResolvedValue({ count: 1 }),
    findMany: jest.fn<() => Promise<unknown>>().mockResolvedValue(courses),
  },
};
const update = jest.fn<() => Promise<unknown>>().mockResolvedValue({ id: 1, dates: [] });
jest.unstable_mockModule("../../../utils/db.ts", () => ({
  prisma: { $transaction: async (callback: (transaction: typeof tx) => Promise<unknown>) => callback(tx), course: { update } },
}));
const { httpInitializeCourseCalendar, httpReplaceCourseCalendarDates } = await import("../../../controllers/course/http-course-calendar.ts");

function response() {
  const res = { json: jest.fn(), status: jest.fn() };
  res.status.mockReturnValue(res);
  return res as unknown as Response;
}

beforeEach(() => {
  jest.clearAllMocks();
  tx.module.findUnique.mockResolvedValue({ id: 42, minDate: new Date("2026-09-01"), maxDate: new Date("2026-09-30"), courses });
});

describe("persistance du calendrier", () => {
  it("initialise les nouveaux cours, préserve les plages existantes et laisse les orphelins sans dates", async () => {
    const res = response();
    const next = jest.fn() as NextFunction;
    await httpInitializeCourseCalendar({ params: { moduleId: "42" } } as unknown as Request, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(tx.course.updateMany).toHaveBeenCalledTimes(2);
    expect(tx.course.updateMany).toHaveBeenNthCalledWith(1, expect.objectContaining({
      where: { id: 1, calendarInitialized: false },
      data: { calendarInitialized: true, dates: [expect.objectContaining({ minDate: "2026-09-01T00:00:00.000Z", maxDate: "2026-09-10T00:00:00.000Z" })] },
    }));
    expect(tx.course.updateMany).toHaveBeenNthCalledWith(2, {
      where: { id: 3, calendarInitialized: false }, data: { calendarInitialized: true },
    });
  });
  it("ne réinitialise rien à la réouverture du calendrier", async () => {
    tx.module.findUnique.mockResolvedValue({ id: 42, courses: courses.map(course => ({ ...course, calendarInitialized: true })) });
    await httpInitializeCourseCalendar({ params: { moduleId: "42" } } as unknown as Request, response(), jest.fn());
    expect(tx.course.updateMany).not.toHaveBeenCalled();
  });
  it("enregistre la suppression de toutes les dates en une écriture et mémorise ce choix", async () => {
    await httpReplaceCourseCalendarDates({ params: { courseId: "1" }, body: { dates: [] } } as unknown as Request, response(), jest.fn());
    expect(update).toHaveBeenCalledWith({ where: { id: 1 }, data: { dates: [], calendarInitialized: true }, select: { id: true, dates: true } });
  });
});
