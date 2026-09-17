import { jest } from "@jest/globals";
import {
  createModelMock,
  createWhereRecorder,
  requireDatabaseRow,
} from "../../../../tests/utils/prisma-mock.ts";

const findMany = jest
  .fn<(...args: any[]) => Promise<unknown>>()
  .mockResolvedValue([]);
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
  requireDatabaseRow,
}));
jest.unstable_mockModule("../../../helpers/enrich-contacts-with-names.ts", () => ({
  enrichContactsWithNames: jest.fn(),
}));

const { getStudentAssignments } = await import("../assignment.ts");

beforeEach(() => {
  jest.clearAllMocks();
  filters.length = 0;
});

it("borne les devoirs aux parcours accessibles et au contenu publié", async () => {
  await getStudentAssignments("student-mdb", [4, 9]);

  expect(filters).toContainEqual({
    course: {
      isPublished: true,
      visibility: true,
      module: { parcoursId: { in: [4, 9] } },
    },
  });
  expect(filters).toContainEqual({
    student: { idMdb: "student-mdb" },
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
});
