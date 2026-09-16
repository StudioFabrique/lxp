import { jest } from "@jest/globals";
import type { Request, Response, NextFunction } from "express";
import {
  createModelMock,
  createWhereRecorder,
  requireDatabaseRow,
} from "../../../../tests/utils/prisma-mock.ts";

const courses = [
  { id: 1, calendarInitialized: false, dates: [] as object[] },
  { id: 2, calendarInitialized: true, dates: [] as object[] },
  {
    id: 3,
    calendarInitialized: false,
    dates: [{ id: 8, minDate: "2026-10-01", maxDate: "2026-10-10" }],
  },
];
const findModule = jest.fn<() => Promise<unknown>>();
const updateMany = jest.fn<() => Promise<number>>().mockResolvedValue(1);
const findCourses = jest.fn<() => Promise<unknown>>().mockResolvedValue(courses);
const update = jest
  .fn<() => Promise<unknown>>()
  .mockResolvedValue({ id: 1, dates: [] });
const moduleModel = createModelMock(
  { first: findModule },
  { evaluateWhere: true },
);
const transactionCourseModel = createModelMock(
  { updateAndCount: updateMany, all: findCourses },
  { evaluateWhere: true },
);
const rootCourseModel = createModelMock(
  { update },
  { evaluateWhere: true },
);
const tx = {
  orm: {
    public: { Module: moduleModel, Course: transactionCourseModel },
  },
};
const { filters, whereFromObject } = createWhereRecorder();
jest.unstable_mockModule("../../../utils/db.ts", () => ({
  prisma: {
    transaction: async (
      callback: (transaction: typeof tx) => Promise<unknown>,
    ) => callback(tx),
    orm: { public: { Course: rootCourseModel } },
  },
}));
jest.unstable_mockModule("../../../utils/prisma-query.ts", () => ({
  whereFromObject,
  requireDatabaseRow,
}));
const { httpInitializeCourseCalendar, httpReplaceCourseCalendarDates } =
  await import("../../../controllers/course/http-course-calendar.ts");

function response() {
  const res = { json: jest.fn(), status: jest.fn() };
  res.status.mockReturnValue(res);
  return res as unknown as Response;
}

beforeEach(() => {
  jest.clearAllMocks();
  filters.length = 0;
  findModule.mockResolvedValue({
    id: 42,
    minDate: new Date("2026-09-01"),
    maxDate: new Date("2026-09-30"),
    courses,
  });
});

describe("persistance du calendrier", () => {
  it("initialise les nouveaux cours, préserve les plages existantes et laisse les orphelins sans dates", async () => {
    const res = response();
    const next = jest.fn() as NextFunction;
    await httpInitializeCourseCalendar(
      { params: { moduleId: "42" } } as unknown as Request,
      res,
      next,
    );
    expect(next).not.toHaveBeenCalled();
    expect(updateMany).toHaveBeenCalledTimes(2);
    expect(updateMany).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        calendarInitialized: true,
        dates: [
          expect.objectContaining({
            minDate: "2026-09-01T00:00:00.000Z",
            maxDate: "2026-09-10T00:00:00.000Z",
          }),
        ],
      }),
    );
    expect(updateMany).toHaveBeenNthCalledWith(2, {
      calendarInitialized: true,
    });
    expect(filters).toContainEqual({ id: 1, calendarInitialized: false });
    expect(filters).toContainEqual({ id: 3, calendarInitialized: false });
  });
  it("ne réinitialise rien à la réouverture du calendrier", async () => {
    findModule.mockResolvedValue({
      id: 42,
      courses: courses.map((course) => ({
        ...course,
        calendarInitialized: true,
      })),
    });
    await httpInitializeCourseCalendar(
      { params: { moduleId: "42" } } as unknown as Request,
      response(),
      jest.fn(),
    );
    expect(updateMany).not.toHaveBeenCalled();
  });
  it("enregistre la suppression de toutes les dates en une écriture et mémorise ce choix", async () => {
    await httpReplaceCourseCalendarDates(
      { params: { courseId: "1" }, body: { dates: [] } } as unknown as Request,
      response(),
      jest.fn(),
    );
    expect(update).toHaveBeenCalledWith({
      dates: [],
      calendarInitialized: true,
    });
    expect(filters).toContainEqual({ id: 1 });
  });
});
