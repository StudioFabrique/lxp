import { jest } from "@jest/globals";

const findMany = jest
  .fn<(...args: any[]) => Promise<unknown>>()
  .mockResolvedValue([]);
const groupFind = jest.fn();

jest.unstable_mockModule("../../../utils/db.ts", () => ({
  prisma: { courseAssignment: { findMany } },
}));
jest.unstable_mockModule("../../../utils/interfaces/db/group.ts", () => ({
  default: { find: groupFind },
}));

const { getTeacherUpcomingAssignments } = await import(
  "../teacher-assignments.ts"
);

beforeEach(() => jest.clearAllMocks());

it("borne les évaluations à venir aux modules affectés au formateur", async () => {
  const now = new Date("2026-09-14T12:00:00.000Z");
  await getTeacherUpcomingAssignments([4, 9], now);

  expect(findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: {
        dueAt: { gte: now },
        course: {
          isPublished: true,
          visibility: true,
          moduleId: { in: [4, 9] },
        },
      },
      orderBy: [{ dueAt: "asc" }, { id: "asc" }],
    }),
  );
  const query = findMany.mock.calls[0][0];
  expect(query.select.course.select.module.select.parcours.select.groups).toEqual(
    { select: { group: { select: { idMdb: true } } } },
  );
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

  const result = await getTeacherUpcomingAssignments(
    [4],
    new Date("2026-09-14T12:00:00.000Z"),
  );

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
