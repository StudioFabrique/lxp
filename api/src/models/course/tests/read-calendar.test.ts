import { jest } from "@jest/globals";
import type { AccessScope } from "../../../utils/services/permissions/accessible-parcours.ts";
import { createModelMock } from "../../../../tests/utils/prisma-mock.ts";
const findFirst = jest
  .fn<(...args: any[]) => Promise<unknown>>()
  .mockResolvedValue(null);
const findMany = jest
  .fn<(...args: any[]) => Promise<unknown>>()
  .mockResolvedValue([]);
const parcoursModel = createModelMock(
  { first: findFirst, all: findMany },
  { evaluateIncludes: true },
);
jest.unstable_mockModule("../../../utils/db.ts", () => ({
  prisma: { orm: { public: { Parcours: parcoursModel } } },
}));
const { getCalendarParcours, getParcoursCalendar } =
  await import("../get-read-calendar.ts");

beforeEach(() => {
  jest.clearAllMocks();
});
const teacher: AccessScope = {
  kind: "teacher",
  parcoursIds: [1],
  directParcoursIds: [1],
  moduleIds: [12],
};
const student: AccessScope = {
  kind: "learner",
  parcoursIds: [2],
  directParcoursIds: null,
  moduleIds: null,
};

it("borne les badges aux parcours autorisés", async () => {
  await getCalendarParcours(teacher);
  expect(parcoursModel.where).toHaveBeenCalled();
});
it("borne les modules aux affectations du formateur même en changeant l'ID demandé", async () => {
  expect(await getParcoursCalendar(999, teacher)).toBeNull();
  expect(parcoursModel.where).toHaveBeenCalled();
});
it("ne livre aux apprenants que les cours et liens de leçons publiés et visibles", async () => {
  await getParcoursCalendar(2, student);
  expect(parcoursModel.where).toHaveBeenCalled();
  expect(parcoursModel.include).toHaveBeenCalledWith(
    "assignment",
    expect.any(Function),
  );
});
it("laisse l'administration consulter tous les modules du parcours choisi", async () => {
  await getParcoursCalendar(1, null);
  expect(parcoursModel.where).toHaveBeenCalledWith({ id: 1 });
});
