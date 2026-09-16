import { jest } from "@jest/globals";
import type { AccessScope } from "../../../utils/services/permissions/accessible-parcours.ts";
import {
  createModelMock,
  createWhereRecorder,
} from "../../../../tests/utils/prisma-mock.ts";
const findFirst = jest.fn<(...args: any[]) => Promise<unknown>>().mockResolvedValue(null);
const findMany = jest.fn<(...args: any[]) => Promise<unknown>>().mockResolvedValue([]);
const parcoursModel = createModelMock(
  { first: findFirst, all: findMany },
  { evaluateWhere: true, evaluateIncludes: true },
);
const { filters, whereFromObject } = createWhereRecorder();
jest.unstable_mockModule("../../../utils/db.ts", () => ({
  prisma: { orm: { public: { Parcours: parcoursModel } } },
}));
jest.unstable_mockModule("../../../utils/prisma-query.ts", () => ({
  whereFromObject,
}));
const { getCalendarParcours, getParcoursCalendar } = await import("../get-read-calendar.ts");

beforeEach(() => {
  jest.clearAllMocks();
  filters.length = 0;
});
const teacher: AccessScope = { kind: "teacher", parcoursIds: [1], directParcoursIds: [1], moduleIds: [12] };
const student: AccessScope = { kind: "learner", parcoursIds: [2], directParcoursIds: null, moduleIds: null };

it("borne les badges aux parcours autorisés", async () => {
  await getCalendarParcours(teacher);
  expect(filters).toContainEqual({ id: { in: [1] } });
});
it("borne les modules aux affectations du formateur même en changeant l'ID demandé", async () => {
  expect(await getParcoursCalendar(999, teacher)).toBeNull();
  expect(filters).toContainEqual({ AND: [{ id: 999 }, { id: { in: [1] } }] });
  expect(filters).toContainEqual({ id: { in: [12] } });
  expect(filters).toContainEqual({});
});
it("ne livre aux apprenants que les cours et liens de leçons publiés et visibles", async () => {
  await getParcoursCalendar(2, student);
  expect(filters).toContainEqual({ AND: [{ id: 2 }, { id: { in: [2] } }] });
  expect(filters).toContainEqual({ parcoursId: { in: [2] } });
  expect(
    filters.filter(
      (filter) =>
        JSON.stringify(filter) ===
        JSON.stringify({ isPublished: true, visibility: true }),
    ),
  ).toHaveLength(2);
  expect(parcoursModel.include).toHaveBeenCalledWith(
    "assignment",
    expect.any(Function),
  );
});
it("laisse l'administration consulter tous les modules du parcours choisi", async () => {
  await getParcoursCalendar(1, null);
  expect(filters).toContainEqual({ AND: [{ id: 1 }, {}] });
  expect(filters).toContainEqual(undefined);
  expect(filters).toContainEqual({});
});
