import { jest } from "@jest/globals";
import { createModelMock } from "../../../../tests/utils/prisma-mock.ts";

const moduleCount = jest.fn<() => Promise<{ total: number }>>();
const findContact = jest.fn<() => Promise<{ id: number } | null>>();
const deleteMany = jest.fn<() => Promise<number>>();
const moduleModel = createModelMock(
  { aggregate: moduleCount },
  { evaluateWhere: true },
);
const contactModel = createModelMock(
  { first: findContact },
  { evaluateWhere: true },
);
const associationModel = createModelMock(
  { deleteAndCount: deleteMany },
  { evaluateWhere: true },
);
const transaction = jest.fn(
  async (callback: (tx: unknown) => Promise<unknown>) =>
    callback({
      orm: {
        public: {
          Module: moduleModel,
          Contact: contactModel,
          ContactsOnModule: associationModel,
        },
      },
    }),
);

jest.unstable_mockModule("../../../utils/db.ts", () => ({
  prisma: { transaction },
}));

const { default: removeContactFromModule } =
  await import("../remove-contact-from-module.ts");

describe("retrait d'une ressource pédagogique d'un module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("supprime uniquement l'association demandée", async () => {
    moduleCount.mockResolvedValue({ total: 1 });
    deleteMany.mockResolvedValue(1);

    await expect(
      removeContactFromModule({ parcoursId: 9, moduleId: 3, contactId: 7 }),
    ).resolves.toEqual({ count: 1 });
  });

  it("borne le module au périmètre du formateur", async () => {
    moduleCount.mockResolvedValue({ total: 1 });
    findContact.mockResolvedValue({ id: 12 });
    deleteMany.mockResolvedValue(1);

    await removeContactFromModule(
      { parcoursId: 9, moduleId: 3, contactId: 7 },
      {
        kind: "teacher",
        parcoursIds: [9],
        directParcoursIds: [9],
        moduleIds: [3],
      },
      "teacher-id",
    );

    expect(moduleModel.where).toHaveBeenCalled();
  });

  it("empêche un formateur de retirer sa propre affectation", async () => {
    moduleCount.mockResolvedValue({ total: 1 });
    findContact.mockResolvedValue({ id: 7 });

    await expect(
      removeContactFromModule(
        { parcoursId: 9, moduleId: 3, contactId: 7 },
        {
          kind: "teacher",
          parcoursIds: [9],
          directParcoursIds: [9],
          moduleIds: [3],
        },
        "teacher-id",
      ),
    ).rejects.toMatchObject({ statusCode: 400 });
    expect(deleteMany).not.toHaveBeenCalled();
  });
});
