import { jest } from "@jest/globals";
import {
  createModelMock,
  requireDatabaseRow,
} from "../../../../tests/utils/prisma-mock.ts";

const findMany = jest
  .fn<(...args: any[]) => Promise<unknown>>()
  .mockResolvedValue([]);
const assignmentModel = createModelMock(
  { all: findMany },
  { evaluateWhere: true, evaluateIncludes: true },
);

jest.unstable_mockModule("../../../utils/db.ts", () => ({
  prisma: { orm: { public: { CourseAssignment: assignmentModel } } },
}));

jest.unstable_mockModule(
  "../../../helpers/enrich-contacts-with-names.ts",
  () => ({
    enrichContactsWithNames: jest.fn(),
  }),
);

const { getStudentAssignments } = await import("../assignment.ts");

beforeEach(() => {
  jest.clearAllMocks();
});

it("borne les devoirs aux parcours accessibles et au contenu publié", async () => {
  await getStudentAssignments("student-mdb", [4, 9]);

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
