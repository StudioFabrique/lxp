import { jest } from "@jest/globals";
import type { AccessScope } from "../../../utils/services/permissions/accessible-parcours.ts";
const findFirst = jest.fn<(...args: any[]) => Promise<unknown>>().mockResolvedValue(null);
const findMany = jest.fn<(...args: any[]) => Promise<unknown>>().mockResolvedValue([]);
jest.unstable_mockModule("../../../utils/db.ts", () => ({ prisma: { parcours: { findFirst, findMany } } }));
const { getCalendarParcours, getParcoursCalendar } = await import("../get-read-calendar.ts");

beforeEach(() => jest.clearAllMocks());
const teacher: AccessScope = { kind: "teacher", parcoursIds: [1], directParcoursIds: [1], moduleIds: [12] };
const student: AccessScope = { kind: "learner", parcoursIds: [2], directParcoursIds: null, moduleIds: null };

it("borne les badges aux parcours autorisés", async () => {
  await getCalendarParcours(teacher);
  expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { id: { in: [1] } } }));
});
it("borne les modules aux affectations du formateur même en changeant l'ID demandé", async () => {
  expect(await getParcoursCalendar(999, teacher)).toBeNull();
  const query = findFirst.mock.calls[0][0];
  expect(query.where).toEqual({ AND: [{ id: 999 }, { id: { in: [1] } }] });
  expect(query.select.modules.where).toEqual({ id: { in: [12] } });
  expect(query.select.modules.select.courses.where).toEqual({});
});
it("ne livre aux apprenants que les cours et liens de leçons publiés et visibles", async () => {
  await getParcoursCalendar(2, student);
  const query = findFirst.mock.calls[0][0];
  expect(query.where).toEqual({ AND: [{ id: 2 }, { id: { in: [2] } }] });
  expect(query.select.modules.where).toEqual({ parcoursId: { in: [2] } });
  expect(query.select.modules.select.courses.where).toEqual({ isPublished: true, visibility: true });
  expect(query.select.modules.select.courses.select.lessons.where).toEqual({ isPublished: true, visibility: true });
});
it("laisse l'administration consulter tous les modules du parcours choisi", async () => {
  await getParcoursCalendar(1, null);
  const query = findFirst.mock.calls[0][0];
  expect(query.where).toEqual({ AND: [{ id: 1 }, {}] });
  expect(query.select.modules.where).toBeUndefined();
  expect(query.select.modules.select.courses.where).toEqual({});
});
