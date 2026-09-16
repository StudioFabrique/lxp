import { jest } from "@jest/globals";
import {
  createModelMock,
  createWhereRecorder,
} from "../../../../tests/utils/prisma-mock.ts";

const moduleCount = jest.fn<() => Promise<{ total: number }>>();
const contactCount = jest.fn<() => Promise<{ total: number }>>();
const createMany = jest.fn<() => Promise<number>>();
const moduleModel = createModelMock(
  { aggregate: moduleCount },
  { evaluateWhere: true },
);
const contactModel = createModelMock(
  { aggregate: contactCount },
  { evaluateWhere: true },
);
const associationModel = createModelMock({ createAndCount: createMany });
const { filters, whereFromObject } = createWhereRecorder();
const transaction = jest.fn(
  async (callback: (tx: unknown) => Promise<unknown>) =>
    callback({
      orm: {
        public: {
          Module: moduleModel,
          ContactsOnParcours: contactModel,
          ContactsOnModule: associationModel,
        },
      },
    }),
);

jest.unstable_mockModule("../../../utils/db.ts", () => ({
  prisma: { transaction },
}));
jest.unstable_mockModule("../../../utils/prisma-query.ts", () => ({
  whereFromObject,
}));

const { default: assignContactsToModules } =
  await import("../assign-contacts-to-modules.ts");

describe("affectation rapide des ressources pédagogiques", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    filters.length = 0;
  });

  it("ajoute toutes les associations demandées sans doublons", async () => {
    moduleCount.mockResolvedValue({ total: 2 });
    contactCount.mockResolvedValue({ total: 2 });
    createMany.mockResolvedValue(4);

    await expect(
      assignContactsToModules({
        parcoursId: 9,
        moduleIds: [3, 4, 4],
        contactIds: [7, 8, 8],
      }),
    ).resolves.toEqual({ count: 4 });

    expect(createMany).toHaveBeenCalledWith([
      { moduleId: 3, contactId: 7 },
      { moduleId: 3, contactId: 8 },
      { moduleId: 4, contactId: 7 },
      { moduleId: 4, contactId: 8 },
    ]);
  });

  it("refuse une ressource qui n'appartient pas au parcours", async () => {
    moduleCount.mockResolvedValue({ total: 1 });
    contactCount.mockResolvedValue({ total: 0 });

    await expect(
      assignContactsToModules({
        parcoursId: 9,
        moduleIds: [3],
        contactIds: [7],
      }),
    ).rejects.toMatchObject({ statusCode: 400 });
    expect(createMany).not.toHaveBeenCalled();
  });

  it("borne les modules au périmètre du formateur", async () => {
    moduleCount.mockResolvedValue({ total: 1 });
    contactCount.mockResolvedValue({ total: 1 });
    createMany.mockResolvedValue(1);

    await assignContactsToModules(
      { parcoursId: 9, moduleIds: [3], contactIds: [7] },
      {
        kind: "teacher",
        parcoursIds: [9],
        directParcoursIds: [9],
        moduleIds: [3],
      },
    );

    expect(filters).toContainEqual({
      id: { in: [3] },
      parcoursId: 9,
      AND: [{ id: { in: [3] } }],
    });
  });
});
