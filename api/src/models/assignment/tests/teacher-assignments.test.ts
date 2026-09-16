import { jest } from "@jest/globals";
import {
  createModelMock,
  createWhereRecorder,
} from "../../../../tests/utils/prisma-mock.ts";

const findMany = jest
  .fn<(...args: any[]) => Promise<unknown>>()
  .mockResolvedValue([]);
const groupFind = jest.fn();
const assignmentModel = createModelMock(
  { all: findMany },
  { evaluateWhere: true, evaluateIncludes: true },
);
const { filters, whereFromObject } = createWhereRecorder();

jest.unstable_mockModule("../../../utils/db.ts", () => ({
  prisma: { orm: { public: { CourseAssignment: assignmentModel } } },
}));
jest.unstable_mockModule("../../../utils/prisma-query.ts", () => ({
  whereFromObject,
}));
jest.unstable_mockModule("../../../utils/interfaces/db/group.ts", () => ({
  default: { find: groupFind },
}));

const { getTeacherUpcomingAssignments } = await import(
  "../teacher-assignments.ts"
);

beforeEach(() => {
  jest.clearAllMocks();
  filters.length = 0;
});

it("borne les évaluations aux modules affectés au formateur, échéances passées incluses", async () => {
  await getTeacherUpcomingAssignments([4, 9]);

  expect(filters).toContainEqual({
    course: {
      isPublished: true,
      visibility: true,
      moduleId: { in: [4, 9] },
    },
  });
  expect(assignmentModel.include).toHaveBeenCalledWith(
    "course",
    expect.any(Function),
  );
  expect(assignmentModel.include).toHaveBeenCalledWith(
    "submissions",
    expect.any(Function),
  );
  expect(assignmentModel.orderBy).toHaveBeenCalled();
  expect(groupFind).not.toHaveBeenCalled();
});

it("associe les étudiants des groupes à leur remise", async () => {
  findMany.mockResolvedValueOnce([
    {
      id: 7,
      dueAt: new Date("2026-09-20T12:00:00.000Z"),
      maxScore: 20,
      course: {
        id: 8,
        title: "Mise en situation",
        module: {
          id: 4,
          title: "Accueil client",
          parcours: {
            id: 2,
            title: "Réception",
            groups: [{ group: { idMdb: "group-1" } }],
          },
        },
      },
      submissions: [
        {
          id: 11,
          submittedAt: new Date("2026-09-14T12:00:00.000Z"),
          grade: null,
          gradedAt: null,
          student: { idMdb: "student-1" },
        },
      ],
    },
  ]);
  const lean = jest.fn<() => Promise<unknown>>().mockResolvedValue([
    {
      _id: "group-1",
      users: [
        {
          _id: "student-1",
          firstname: "Zoé",
          lastname: "Martin",
          email: "zoe@example.com",
        },
        {
          _id: "student-2",
          firstname: "Alice",
          lastname: "Bernard",
          email: "alice@example.com",
        },
      ],
    },
  ]);
  const populate = jest.fn().mockReturnValue({ lean });
  groupFind.mockReturnValue({ populate });

  const result = await getTeacherUpcomingAssignments([4]);

  expect(result[0].course.module.parcours).toEqual({
    id: 2,
    title: "Réception",
  });
  expect(result[0].students.map(({ id }) => id)).toEqual([
    "student-2",
    "student-1",
  ]);
  expect(result[0].students[1].submission).toEqual(
    expect.objectContaining({ id: 11 }),
  );
});
