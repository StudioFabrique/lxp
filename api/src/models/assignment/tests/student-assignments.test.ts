import { jest } from "@jest/globals";

const findMany = jest
  .fn<(...args: any[]) => Promise<unknown>>()
  .mockResolvedValue([]);

jest.unstable_mockModule("../../../utils/db.ts", () => ({
  prisma: { courseAssignment: { findMany } },
}));
jest.unstable_mockModule("../../../helpers/enrich-contacts-with-names.ts", () => ({
  enrichContactsWithNames: jest.fn(),
}));

const { getStudentAssignments } = await import("../assignment.ts");

beforeEach(() => jest.clearAllMocks());

it("borne les devoirs aux parcours accessibles et au contenu publié", async () => {
  await getStudentAssignments("student-mdb", [4, 9]);

  expect(findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: {
        course: {
          isPublished: true,
          visibility: true,
          module: { parcoursId: { in: [4, 9] } },
        },
      },
      orderBy: [{ dueAt: "asc" }, { id: "asc" }],
    }),
  );
  const query = findMany.mock.calls[0][0];
  expect(query.select.submissions.where).toEqual({
    student: { idMdb: "student-mdb" },
  });
  expect(query.select.course.select.module.select.parcours).toEqual({
    select: { id: true, title: true },
  });
});
